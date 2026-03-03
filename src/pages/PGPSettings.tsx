import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KeyRound, ShieldCheck, Upload } from "lucide-react";

export default function PGPSettings() {
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">PGP Settings</h1>
          <p className="page-description">Manage PGP private key for file decryption</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Private Key
            </CardTitle>
            <CardDescription>ASCII-armored PGP private key for decrypting incoming files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ASCII-Armored Private Key</Label>
              <Textarea
                placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----&#10;...&#10;-----END PGP PRIVATE KEY BLOCK-----"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="font-mono text-xs min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Passphrase</Label>
              <Input
                type="password"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Save Key
              </Button>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Key File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Decryption</CardTitle>
            <CardDescription>Verify decryption works with a sample file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Save your key first, then select a file from FTP to test decryption</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
