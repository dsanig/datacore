import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Save, Trash2, FileText, Filter, Table, Database, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ConfigEditor() {
  const { name } = useParams();
  const navigate = useNavigate();
  const isNew = name === "new";

  const [configName, setConfigName] = useState(isNew ? "" : name || "");
  const [keywords, setKeywords] = useState(isNew ? "" : "GLOBAL_DAILY");
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
              <div className="rounded-lg border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Example match:</strong>{" "}
                  <code className="font-mono text-foreground">GLOBAL_DAILY.20260220.20260220.csv.pgp</code>
                  {" "}→ keywords match, dates extracted: 2026-02-20
                </p>
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
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge>Parser 1</Badge>
                    <span className="font-semibold">MTMP Mark-to-Market</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Row Pre-Filter
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Select defaultValue="equals">
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                        <SelectItem value="startsWith">startsWith</SelectItem>
                        <SelectItem value="regex">regex</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Column" defaultValue="col1" className="font-mono text-xs" />
                    <Input placeholder="Value" defaultValue="DATA" className="font-mono text-xs" />
                    <Select defaultValue="AND">
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Select defaultValue="equals">
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                        <SelectItem value="startsWith">startsWith</SelectItem>
                        <SelectItem value="regex">regex</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Column" defaultValue="col2" className="font-mono text-xs" />
                    <Input placeholder="Value" defaultValue="MTMP" className="font-mono text-xs" />
                    <Button variant="outline" size="sm" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Rule
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Header Detection</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Select defaultValue="colEquals">
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colEquals">Column N equals</SelectItem>
                        <SelectItem value="containsTokens">Contains header tokens</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Column" defaultValue="col3" className="font-mono text-xs" />
                    <Input placeholder="Value" defaultValue="AssetClass" className="font-mono text-xs" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Section End Rule</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Select defaultValue="colBlank">
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colBlank">Column N is blank</SelectItem>
                        <SelectItem value="regex">Row matches regex</SelectItem>
                        <SelectItem value="nextHeader">Next header begins</SelectItem>
                        <SelectItem value="nRows">After N rows</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Column / Value" defaultValue="col3" className="font-mono text-xs" />
                  </div>
                </div>
              </div>
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
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-6 gap-2 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Field Name</span>
                  <span>Type</span>
                  <span>Source</span>
                  <span>Transform</span>
                  <span>Required</span>
                  <span>Validation</span>
                </div>
                {[
                  { name: "asset_class", type: "string", source: "AssetClass", transform: "trim,upper", required: true },
                  { name: "instrument_id", type: "string", source: "InstrumentID", transform: "trim", required: true },
                  { name: "mark_price", type: "decimal", source: "MarkPrice", transform: "cast", required: true },
                  { name: "valuation_date", type: "date", source: "ValDate", transform: "parseDate(DD/MM/YYYY)", required: true },
                  { name: "currency", type: "string", source: "Currency", transform: "trim,upper", required: false },
                ].map((field) => (
                  <div key={field.name} className="grid grid-cols-6 gap-2 p-3 border-t items-center">
                    <Input defaultValue={field.name} className="font-mono text-xs h-8" />
                    <Select defaultValue={field.type}>
                      <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="int">int</SelectItem>
                        <SelectItem value="float">float</SelectItem>
                        <SelectItem value="decimal">decimal</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                        <SelectItem value="date">date</SelectItem>
                        <SelectItem value="timestamp">timestamp</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input defaultValue={field.source} className="font-mono text-xs h-8" />
                    <Input defaultValue={field.transform} className="font-mono text-xs h-8" />
                    <Switch defaultChecked={field.required} />
                    <Button variant="ghost" size="sm" className="text-xs h-8">Edit</Button>
                  </div>
                ))}
              </div>
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
              <div className="rounded-lg border p-3 bg-info/10">
                <p className="text-sm text-info">
                  Data is stored in Lovable Cloud. Local PostgreSQL export can be configured separately.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Table Name</Label>
                  <Input placeholder="mtmp_marks" className="font-mono" />
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
                <Input placeholder="instrument_id, valuation_date" className="font-mono" />
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
