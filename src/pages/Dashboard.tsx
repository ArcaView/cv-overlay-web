import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, Eye, MousePointerClick, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['analytics-metrics'],
    queryFn: () => api.analytics.getMetrics('7d'),
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your account performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Views"
              value={metrics?.totalViews.toLocaleString()}
              trend={metrics?.trends.views}
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Total Clicks"
              value={metrics?.totalClicks.toLocaleString()}
              trend={metrics?.trends.clicks}
              icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics?.conversionRate}%`}
              trend={metrics?.trends.conversion}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Revenue"
              value={`$${metrics?.revenue.toLocaleString()}`}
              trend={metrics?.trends.revenue}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>
              View detailed analytics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/analytics">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and view invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/billing">
                Manage Billing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/settings">
                Edit Settings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick tips to help you get the most out of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Set up your profile</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile information in the settings page
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Connect your data sources</p>
                <p className="text-sm text-muted-foreground">
                  Integrate your platforms to start tracking analytics
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Review your analytics</p>
                <p className="text-sm text-muted-foreground">
                  Check your performance metrics and insights regularly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value?: string;
  trend?: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {isPositive && (
              <>
                <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{trend}%</span>
              </>
            )}
            {isNegative && (
              <>
                <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
                <span className="text-red-600">{trend}%</span>
              </>
            )}
            {!isPositive && !isNegative && (
              <span className="text-muted-foreground">0%</span>
            )}
            <span className="ml-1">from last period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
