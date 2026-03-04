import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Save, FileText, Filter, Table, Database, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ConfigEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const isNew = name === "new";

  const [configName, setConfigName] = useState(isNew ? "" : name || "");
  const [keywords, setKeywords] = useState("");
  const [datePattern, setDatePattern] = useState("YYYYMMDD");
  const [dateWindow, setDateWindow] = useState("today");

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/configurations")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="page-title">{isNew ? "New Configuration" : configName}</h1>
            <p className="page-description">Define file routing, parsers, and output schema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Save & Activate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="routing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routing" className="gap-2">
            <FileText className="h-4 w-4" />
            File Routing
          </TabsTrigger>
          <TabsTrigger value="parsers" className="gap-2">
            <Filter className="h-4 w-4" />
            Parsers
          </TabsTrigger>
          <TabsTrigger value="schema" className="gap-2">
            <Table className="h-4 w-4" />
            Output Schema
          </TabsTrigger>
          <TabsTrigger value="target" className="gap-2">
            <Database className="h-4 w-4" />
            Target DB
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routing">
          <Card>
            <CardHeader>
              <CardTitle>File Routing Rules</CardTitle>
              <CardDescription>Define how incoming files are matched to this configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Configuration Name</Label>
                <Input value={configName} onChange={(e) => setConfigName(e.target.value)} placeholder="e.g., MTMP Mark-to-Market" />
              </div>
              <div className="space-y-2">
                <Label>File Type Keywords</Label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="GLOBAL_DAILY, RISK" className="font-mono" />
                <p className="text-xs text-muted-foreground">Comma-separated keywords that must appear in the filename</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Pattern</Label>
                  <Select value={datePattern} onValueChange={setDatePattern}>
                    <SelectTrigger className="font-mono"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYYMMDD">YYYYMMDD</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Window</Label>
                  <Select value={dateWindow} onValueChange={setDateWindow}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today only</SelectItem>
                      <SelectItem value="last3">Last 3 days</SelectItem>
                      <SelectItem value="last7">Last 7 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parsers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Parser Blocks</CardTitle>
                  <CardDescription>Define sections to extract from the decrypted CSV</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Parser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">No parsers defined. Click "Add Parser" to create one.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output Schema</CardTitle>
                  <CardDescription>Define the structured output fields and mappings</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">No fields defined. Click "Add Field" to create your output schema.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target">
          <Card>
            <CardHeader>
              <CardTitle>Target Database</CardTitle>
              <CardDescription>Configure where parsed data is loaded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Table Name</Label>
                  <Input placeholder="e.g., mtmp_marks" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Upsert Mode</Label>
                  <Select defaultValue="append">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="append">Append Only</SelectItem>
                      <SelectItem value="upsert">Upsert (Natural Key)</SelectItem>
                      <SelectItem value="overwrite">Overwrite by Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Natural Key Fields</Label>
                <Input placeholder="e.g., instrument_id, valuation_date" className="font-mono" />
                <p className="text-xs text-muted-foreground">Comma-separated fields for upsert deduplication</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Auto-create Table</Label>
                  <p className="text-xs text-muted-foreground">Create table from schema if it doesn't exist</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
