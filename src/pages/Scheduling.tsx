import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Play, Pause } from "lucide-react";

export default function Scheduling() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Scheduling</h1>
          <p className="page-description">Configure automated pipeline execution</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Schedule Settings
            </CardTitle>
            <CardDescription>Define when the pipeline runs automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                {enabled ? <Play className="h-5 w-5 text-success" /> : <Pause className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <Label className="text-base">Scheduler</Label>
                  <p className="text-xs text-muted-foreground">{enabled ? "Running" : "Paused"}</p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="space-y-2">
              <Label>Interval</Label>
              <Select defaultValue="hourly">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="30min">Every 30 minutes</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Window Start</Label>
                <Input type="time" defaultValue="07:00" />
              </div>
              <div className="space-y-2">
                <Label>Window End</Label>
                <Input type="time" defaultValue="22:00" />
              </div>
            </div>
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">
                Timezone: <strong>Europe/Madrid (CET/CEST)</strong>
              </p>
            </div>
            <div className="space-y-2">
              <Label>Default Date Window</Label>
              <Select defaultValue="today">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today only</SelectItem>
                  <SelectItem value="last3">Last 3 days</SelectItem>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Concurrency Limit</Label>
              <Input type="number" defaultValue="3" min="1" max="10" />
              <p className="text-xs text-muted-foreground">Max files processed in parallel</p>
            </div>
            <Button className="w-full">Save Schedule</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Scheduled Runs</CardTitle>
            <CardDescription>Upcoming execution windows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{enabled ? "Next run in 45 minutes" : "Enable scheduler to see upcoming runs"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
