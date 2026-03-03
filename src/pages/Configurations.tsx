import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, ChevronRight, FileText, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const configs = [
  {
    name: "MTMP Mark-to-Market",
    version: 3,
    active: true,
    keywords: ["GLOBAL_DAILY"],
    parsers: 1,
    targetTable: "mtmp_marks",
    lastRun: "2026-03-03 08:15",
    lastStatus: "success",
  },
  {
    name: "Risk Report",
    version: 1,
    active: true,
    keywords: ["RISK_DAILY"],
    parsers: 2,
    targetTable: "risk_data",
    lastRun: "2026-03-03 08:15",
    lastStatus: "success",
  },
  {
    name: "Position Report",
    version: 2,
    active: false,
    keywords: ["POSITION"],
    parsers: 1,
    targetTable: "positions",
    lastRun: "2026-03-01 08:15",
    lastStatus: "error",
  },
];

export default function Configurations() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurations</h1>
          <p className="page-description">Manage file routing and parser configurations</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/configurations/new")}>
          <Plus className="h-4 w-4" />
          New Configuration
        </Button>
      </div>

      <div className="space-y-3">
        {configs.map((cfg) => (
          <Card
            key={cfg.name}
            className="cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/configurations/${encodeURIComponent(cfg.name)}`)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Settings2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{cfg.name}</h3>
                    <Badge variant="outline" className="text-xs font-mono">v{cfg.version}</Badge>
                    {cfg.active ? (
                      <Badge className="text-xs bg-success/15 text-success border-0">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Keywords: <span className="font-mono">{cfg.keywords.join(", ")}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {cfg.parsers} parser{cfg.parsers > 1 ? "s" : ""} → <span className="font-mono">{cfg.targetTable}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-muted-foreground">
                  <p>Last: {cfg.lastRun}</p>
                  <Badge
                    variant={cfg.lastStatus === "success" ? "default" : "destructive"}
                    className="text-xs mt-1"
                  >
                    {cfg.lastStatus}
                  </Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
