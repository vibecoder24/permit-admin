import { useState } from "react"
import {
  MapPin,
  FileText,
  DollarSign,
  Bell,
  Plus,
  Edit,
  Check,
  X,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { jurisdictions, permitTypes } from "@/data/mock"

export function SettingsPage() {
  const [showAddJurisdiction, setShowAddJurisdiction] = useState(false)
  const [showAddPermitType, setShowAddPermitType] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="System configuration" />

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="jurisdictions">
          <TabsList>
            <TabsTrigger value="jurisdictions">
              <MapPin className="mr-2 h-4 w-4" />
              Jurisdictions
            </TabsTrigger>
            <TabsTrigger value="permit-types">
              <FileText className="mr-2 h-4 w-4" />
              Permit Types
            </TabsTrigger>
            <TabsTrigger value="invoicing">
              <DollarSign className="mr-2 h-4 w-4" />
              Invoice Defaults
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Jurisdictions Tab */}
          <TabsContent value="jurisdictions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Jurisdictions</CardTitle>
                  <CardDescription>Manage available jurisdictions for permit submissions</CardDescription>
                </div>
                <Dialog open={showAddJurisdiction} onOpenChange={setShowAddJurisdiction}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Jurisdiction
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Jurisdiction</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input placeholder="e.g., Orange County" />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input placeholder="e.g., CA" maxLength={2} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddJurisdiction(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddJurisdiction(false)}>
                        Add Jurisdiction
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jurisdictions.map((jurisdiction) => (
                      <TableRow key={jurisdiction.id}>
                        <TableCell className="font-medium">{jurisdiction.name}</TableCell>
                        <TableCell>{jurisdiction.state}</TableCell>
                        <TableCell>
                          <Badge variant={jurisdiction.active ? "success" : "outline"}>
                            {jurisdiction.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              {jurisdiction.active ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permit Types Tab */}
          <TabsContent value="permit-types">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Permit Types</CardTitle>
                  <CardDescription>Manage available permit types</CardDescription>
                </div>
                <Dialog open={showAddPermitType} onOpenChange={setShowAddPermitType}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Permit Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Permit Type</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input placeholder="e.g., Pool" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Brief description of this permit type" rows={3} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPermitType(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddPermitType(false)}>
                        Add Permit Type
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permitTypes.map((permitType) => (
                      <TableRow key={permitType.id}>
                        <TableCell className="font-medium">{permitType.name}</TableCell>
                        <TableCell className="text-muted-foreground max-w-md truncate">
                          {permitType.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={permitType.active ? "success" : "outline"}>
                            {permitType.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              {permitType.active ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Defaults Tab */}
          <TabsContent value="invoicing">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Defaults</CardTitle>
                <CardDescription>Configure default settings for new invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <select className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="due_on_receipt">Due on Receipt</option>
                    <option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option>
                    <option value="net_60">Net 60</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Default payment terms applied to new invoices
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Default Notes Template</Label>
                  <Textarea
                    defaultValue="Thank you for choosing PermitAgent! Payment is due upon receipt. If you have any questions, please contact us."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This text will be pre-filled in the notes field when creating invoices
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Default Line Item Prices</Label>
                  <div className="space-y-2">
                    {permitTypes.filter(pt => pt.active).map((permitType) => (
                      <div key={permitType.id} className="flex items-center gap-4">
                        <span className="w-32 text-sm">{permitType.name}</span>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            defaultValue={150}
                            className="w-32 pl-7"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure when and how notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Customer Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Invoice Created</p>
                        <p className="text-sm text-muted-foreground">
                          Send email when invoice is created
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Permit Ready</p>
                        <p className="text-sm text-muted-foreground">
                          Send email when permit is ready for download
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Send email on major status changes
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-4">Team Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Permit Requests</p>
                        <p className="text-sm text-muted-foreground">
                          Notify admins of new submissions
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Automation Failures</p>
                        <p className="text-sm text-muted-foreground">
                          Alert when automation fails
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-muted-foreground">
                          Notify when payment is received
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stuck Requests Alert</p>
                        <p className="text-sm text-muted-foreground">
                          Daily digest of requests stuck more than 3 days
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
