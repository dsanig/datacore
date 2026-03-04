const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, host, port, username, password, remoteDir, passiveMode } =
      await req.json();

    if (!host || !username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: host, username, password" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const portNum = parseInt(port || "21", 10);

    if (action === "test") {
      // Attempt a basic TCP connection to the FTP host/port
      try {
        const conn = await Deno.connect({ hostname: host, port: portNum });
        const buf = new Uint8Array(1024);
        const n = await conn.read(buf);
        const banner = n ? new TextDecoder().decode(buf.subarray(0, n)) : "";
        
        // Send QUIT
        await conn.write(new TextEncoder().encode(`USER ${username}\r\n`));
        const userBuf = new Uint8Array(1024);
        const userN = await conn.read(userBuf);
        const userResp = userN ? new TextDecoder().decode(userBuf.subarray(0, userN)) : "";
        
        await conn.write(new TextEncoder().encode(`PASS ${password}\r\n`));
        const passBuf = new Uint8Array(1024);
        const passN = await conn.read(passBuf);
        const passResp = passN ? new TextDecoder().decode(passBuf.subarray(0, passN)) : "";
        
        const loginSuccess = passResp.startsWith("230");
        
        await conn.write(new TextEncoder().encode("QUIT\r\n"));
        conn.close();

        return new Response(
          JSON.stringify({
            success: loginSuccess,
            banner: banner.trim(),
            message: loginSuccess ? "Login successful" : `Login failed: ${passResp.trim()}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (connErr) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Cannot connect to ${host}:${portNum} — ${connErr.message}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (action === "list") {
      try {
        const conn = await Deno.connect({ hostname: host, port: portNum });
        
        const readResponse = async (): Promise<string> => {
          const buf = new Uint8Array(4096);
          const n = await conn.read(buf);
          return n ? new TextDecoder().decode(buf.subarray(0, n)).trim() : "";
        };
        
        const sendCommand = async (cmd: string): Promise<string> => {
          await conn.write(new TextEncoder().encode(cmd + "\r\n"));
          return await readResponse();
        };

        // Read banner
        await readResponse();
        
        // Login
        await sendCommand(`USER ${username}`);
        const passResp = await sendCommand(`PASS ${password}`);
        
        if (!passResp.startsWith("230")) {
          conn.close();
          return new Response(
            JSON.stringify({ success: false, error: "Login failed" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Enter passive mode
        const pasvResp = await sendCommand("PASV");
        const pasvMatch = pasvResp.match(/(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)/);
        
        if (!pasvMatch) {
          conn.close();
          return new Response(
            JSON.stringify({ success: false, error: "Failed to enter passive mode" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const dataHost = `${pasvMatch[1]}.${pasvMatch[2]}.${pasvMatch[3]}.${pasvMatch[4]}`;
        const dataPort = parseInt(pasvMatch[5]) * 256 + parseInt(pasvMatch[6]);
        
        const dataConn = await Deno.connect({ hostname: dataHost, port: dataPort });
        
        // CWD then LIST
        if (remoteDir && remoteDir !== "/") {
          await sendCommand(`CWD ${remoteDir}`);
        }
        await sendCommand("LIST");
        
        // Read data
        const chunks: Uint8Array[] = [];
        while (true) {
          const dataBuf = new Uint8Array(8192);
          const dataN = await dataConn.read(dataBuf);
          if (!dataN) break;
          chunks.push(dataBuf.subarray(0, dataN));
        }
        dataConn.close();
        
        const listing = new TextDecoder().decode(
          new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0))
        );
        
        // Parse file names from listing
        const rawText = chunks.map(c => new TextDecoder().decode(c)).join("");
        const files = rawText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            const parts = line.split(/\s+/);
            return parts[parts.length - 1];
          })
          .filter((name) => name && name !== "." && name !== "..");

        await sendCommand("QUIT");
        conn.close();

        return new Response(
          JSON.stringify({ success: true, files }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (connErr) {
        return new Response(
          JSON.stringify({ success: false, error: connErr.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown action. Use 'test' or 'list'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
