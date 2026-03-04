import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
          <Settings2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No configurations yet. Click "New Configuration" to create one.</p>
      </div>
    </div>
  );
}
