import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database as DbIcon } from "lucide-react";

export default function DatabasePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Database</h1>
          <p className="page-description">View loaded data tables and system tables</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {["file_registry", "ingestion_runs", "parser_configs", "mtmp_marks"].map((table) => (
          <Card key={table} className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <DbIcon className="h-4 w-4 text-primary" />
                <span className="font-mono">{table}</span>
              </CardTitle>
              <CardDescription className="text-xs">System table</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Browse and query loaded data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
