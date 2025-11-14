import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Download, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Billing() {
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.billing.getSubscription(),
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.billing.getInvoices(),
  });

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelSubscription = async () => {
    await api.billing.cancelSubscription();
    setCancelDialogOpen(false);
    // Refetch subscription data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your subscription details and payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Plan Info */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold">{subscription?.plan} Plan</h3>
                    <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {subscription?.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Billed {subscription?.billingCycle}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Next billing date: {subscription?.nextBillingDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ${subscription?.amount}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Method
                </h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {subscription?.paymentMethod.brand} ending in {subscription?.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {subscription?.paymentMethod.expiryMonth}/{subscription?.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t pt-6">
                <Button variant="outline">Change Plan</Button>
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Subscription</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your subscription? You'll lose access to all premium features.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        This action cannot be undone. Your subscription will be cancelled at the end of the current billing period.
                      </AlertDescription>
                    </Alert>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                        Keep Subscription
                      </Button>
                      <Button variant="destructive" onClick={handleCancelSubscription}>
                        Cancel Subscription
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={invoice.invoiceUrl} download>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Compare plans and upgrade or downgrade anytime
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <PlanCard
              name="Starter"
              price="$19"
              features={[
                'Up to 10,000 views/month',
                'Basic analytics',
                'Email support',
                '1 user'
              ]}
              current={subscription?.plan === 'Starter'}
            />
            <PlanCard
              name="Pro"
              price="$49"
              features={[
                'Up to 100,000 views/month',
                'Advanced analytics',
                'Priority support',
                '5 users'
              ]}
              current={subscription?.plan === 'Pro'}
              popular
            />
            <PlanCard
              name="Enterprise"
              price="$199"
              features={[
                'Unlimited views',
                'Custom analytics',
                '24/7 phone support',
                'Unlimited users'
              ]}
              current={subscription?.plan === 'Enterprise'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  current?: boolean;
  popular?: boolean;
}

function PlanCard({ name, price, features, current, popular }: PlanCardProps) {
  return (
    <div className={`border rounded-lg p-6 relative ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      {current && (
        <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">
          Current Plan
        </Badge>
      )}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={current ? 'outline' : 'default'}
          disabled={current}
        >
          {current ? 'Current Plan' : 'Select Plan'}
        </Button>
      </div>
    </div>
  );
}
