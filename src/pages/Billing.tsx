import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Calendar, DollarSign } from "lucide-react";

const Billing = () => {
  const currentPlan = {
    name: "Professional",
    price: "$99",
    period: "month",
    status: "Active",
    renewalDate: "December 14, 2025",
    usage: "8,234",
    limit: "50,000",
  };

  const invoices = [
    { id: "INV-2024-001", date: "Nov 14, 2025", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-002", date: "Oct 14, 2025", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-003", date: "Sep 14, 2025", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-004", date: "Aug 14, 2025", amount: "$99.00", status: "Paid" },
  ];

  const paymentMethod = {
    type: "Visa",
    last4: "4242",
    expiry: "12/2026",
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and invoices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your active subscription details</CardDescription>
                  </div>
                  <Badge variant="default">{currentPlan.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{currentPlan.name}</span>
                    <span className="text-muted-foreground">
                      {currentPlan.price}/{currentPlan.period}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Usage this month</p>
                      <p className="text-2xl font-semibold">
                        {currentPlan.usage} <span className="text-sm text-muted-foreground">/ {currentPlan.limit}</span>
                      </p>
                      <div className="w-full bg-secondary h-2 rounded-full mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(parseInt(currentPlan.usage.replace(',', '')) / parseInt(currentPlan.limit.replace(',', ''))) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Next billing date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-lg font-semibold">{currentPlan.renewalDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">{paymentMethod.type} •••• {paymentMethod.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Download and view your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{invoice.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
