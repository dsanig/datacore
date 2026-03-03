import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, RefreshCw, Download, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const runs = [
  { id: "run-001", config: "MTMP Mark-to-Market", parser: "MTMP", file: "GLOBAL_DAILY.20260220.20260220.csv.pgp", status: "success", rows_parsed: 1247, rows_loaded: 1247, duration: "3.2s", started: "2026-03-03 08:15:00", error: null },
  { id: "run-002", config: "Risk Report", parser: "Risk Main", file: "RISK_DAILY.20260220.20260220.csv.pgp", status: "success", rows_parsed: 892, rows_loaded: 892, duration: "2.1s", started: "2026-03-03 08:15:01", error: null },
  { id: "run-003", config: "MTMP Mark-to-Market", parser: "MTMP", file: "GLOBAL_DAILY.20260219.20260219.csv.pgp", status: "error", rows_parsed: 0, rows_loaded: 0, duration: "0.4s", started: "2026-03-02 08:15:00", error: "PGP decryption failed: bad passphrase" },
  { id: "run-004", config: "Position Report", parser: "Positions", file: "POSITION.20260219.20260219.csv.pgp", status: "warning", rows_parsed: 500, rows_loaded: 487, duration: "1.8s", started: "2026-03-02 08:15:02", error: "13 rows failed validation" },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "success": return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "error": return <XCircle className="h-5 w-5 text-destructive" />;
    case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />;
    default: return null;
  }
};

export default function RunsLogs() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Runs & Logs</h1>
          <p className="page-description">Ingestion run history and detailed logs</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Configs</SelectItem>
              <SelectItem value="mtmp">MTMP</SelectItem>
              <SelectItem value="risk">Risk</SelectItem>
              <SelectItem value="position">Position</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Run History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {runs.map((run) => (
              <div key={run.id} className="rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {statusIcon(run.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{run.config}</span>
                        <Badge variant="outline" className="text-xs font-mono">{run.parser}</Badge>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{run.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <p className="font-mono">
                        {run.rows_parsed.toLocaleString()} parsed / {run.rows_loaded.toLocaleString()} loaded
                      </p>
                      <p className="text-muted-foreground">{run.started} · {run.duration}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Re-run
                    </Button>
                  </div>
                </div>
                {run.error && (
                  <div className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive font-mono">
                    {run.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
