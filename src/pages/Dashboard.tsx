import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  FileText,
  Database,
  Server,
} from "lucide-react";

const recentRuns = [
  { id: "run-001", config: "MTMP Mark-to-Market", file: "GLOBAL_DAILY.20260220.20260220.csv.pgp", status: "success", rows: 1247, duration: "3.2s", time: "2026-03-03 08:15:00" },
  { id: "run-002", config: "Risk Report", file: "RISK_DAILY.20260220.20260220.csv.pgp", status: "success", rows: 892, duration: "2.1s", time: "2026-03-03 08:15:01" },
  { id: "run-003", config: "MTMP Mark-to-Market", file: "GLOBAL_DAILY.20260219.20260219.csv.pgp", status: "error", rows: 0, duration: "0.4s", time: "2026-03-02 08:15:00" },
];

const stats = [
  { label: "Files Processed", value: "1,247", icon: FileText, trend: "+12 today" },
  { label: "Active Configs", value: "4", icon: Database, trend: "2 scheduled" },
  { label: "Last Run", value: "08:15", icon: Clock, trend: "3 min ago" },
  { label: "FTP Status", value: "Connected", icon: Server, trend: "Healthy" },
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Pipeline overview and recent activity</p>
        </div>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Run Now
        </Button>
      </div>

      <div className="data-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Runs
          </CardTitle>
          <CardDescription>Latest ingestion activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {run.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{run.config}</p>
                    <p className="text-xs font-mono text-muted-foreground">{run.file}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-mono">{run.rows.toLocaleString()} rows</p>
                    <p className="text-xs text-muted-foreground">{run.duration}</p>
                  </div>
                  <Badge variant={run.status === "success" ? "default" : "destructive"} className="text-xs">
                    {run.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
