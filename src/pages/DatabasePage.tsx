import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
          <DbIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No tables yet. Tables will appear here after your first ingestion run.</p>
      </div>
    </div>
  );
}
