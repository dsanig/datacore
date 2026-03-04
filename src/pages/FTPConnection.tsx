import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Server, TestTube, FolderOpen, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function FTPConnection() {
  const [config, setConfig] = useState({
    host: "",
    port: "21",
    username: "",
    password: "",
    remoteDir: "/incoming",
    passiveMode: true,
  });
  const [testing, setTesting] = useState(false);
  const [listing, setListing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const invokeFunction = async (action: "test" | "list") => {
    const { data, error } = await supabase.functions.invoke("ftp-operations", {
      body: { action, ...config },
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await invokeFunction("test");
      setTestResult({ success: result.success, message: result.message || result.error });
      if (result.success) {
        toast.success("FTP connection successful");
      } else {
        toast.error(result.error || "Connection failed");
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setTesting(false);
    }
  };

  const handleListFiles = async () => {
    setListing(true);
    try {
      const result = await invokeFunction("list");
      if (result.success) {
        setFiles(result.files || []);
        toast.success(`Found ${result.files?.length || 0} files`);
      } else {
        toast.error(result.error || "Failed to list files");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setListing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">FTP Connection</h1>
          <p className="page-description">Configure FTP server connection for file ingestion</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Connection Settings
            </CardTitle>
            <CardDescription>FTP server credentials and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" placeholder="ftp.example.com" value={config.host} onChange={(e) => setConfig({ ...config, host: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="21" value={config.port} onChange={(e) => setConfig({ ...config, port: e.target.value })} className="font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={config.username} onChange={(e) => setConfig({ ...config, username: e.target.value })} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={config.password} onChange={(e) => setConfig({ ...config, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remoteDir">Remote Directory</Label>
              <Input id="remoteDir" placeholder="/incoming" value={config.remoteDir} onChange={(e) => setConfig({ ...config, remoteDir: e.target.value })} className="font-mono" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Passive Mode</Label>
                <p className="text-xs text-muted-foreground">Recommended for firewalled servers</p>
              </div>
              <Switch checked={config.passiveMode} onCheckedChange={(v) => setConfig({ ...config, passiveMode: v })} />
            </div>

            {testResult && (
              <div className={`flex items-center gap-2 rounded-lg border p-3 ${testResult.success ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span className="text-sm">{testResult.message}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button className="gap-2" onClick={() => toast.info("Settings saved locally")}>
                Save Settings
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleTest} disabled={testing || !config.host || !config.username}>
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Remote Files
            </CardTitle>
            <CardDescription>Files available on the FTP server</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full gap-2 mb-4" onClick={handleListFiles} disabled={listing || !config.host || !config.username}>
              {listing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              List Files
            </Button>
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Connect and list files to see available data</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((f) => (
                  <div key={f} className="flex items-center justify-between rounded border p-2">
                    <span className="font-mono text-sm">{f}</span>
                    <Badge variant="outline">{f.endsWith(".pgp") || f.endsWith(".gpg") ? "pgp" : f.split(".").pop()}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
