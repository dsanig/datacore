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

const stats = [
  { label: "Files Processed", value: "0", icon: FileText, trend: "—" },
  { label: "Active Configs", value: "0", icon: Database, trend: "—" },
  { label: "Last Run", value: "—", icon: Clock, trend: "No runs yet" },
  { label: "FTP Status", value: "—", icon: Server, trend: "Not configured" },
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
          <p className="text-sm text-muted-foreground text-center py-8">No runs yet. Configure an FTP connection and parser to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
