import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KeyRound, ShieldCheck, Upload, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function PGPSettings() {
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("pgp_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setSettingsId(data.id);
        setPrivateKey(data.private_key);
        setPassphrase(data.passphrase);
      }
    } catch (err: any) {
      console.error("Failed to load PGP settings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const row = {
        private_key: privateKey,
        passphrase,
        updated_at: new Date().toISOString(),
      };
      if (settingsId) {
        const { error } = await supabase.from("pgp_settings").update(row).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("pgp_settings").insert(row).select().single();
        if (error) throw error;
        setSettingsId(data.id);
      }
      toast.success("PGP settings saved");
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".asc,.gpg,.pgp,.key,.txt";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      setPrivateKey(text);
      toast.info("Key file loaded — click Save to persist");
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
              <Button className="gap-2" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Key
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleUpload}>
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
