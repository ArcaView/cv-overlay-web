import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['analytics-metrics', timeRange],
    queryFn: () => api.analytics.getMetrics(timeRange),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['analytics-chart', timeRange],
    queryFn: () => api.analytics.getChartData('views', timeRange),
  });

  const { data: topPerformers, isLoading: topPerformersLoading } = useQuery({
    queryKey: ['analytics-top-performers'],
    queryFn: () => api.analytics.getTopPerformers(),
  });

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Track your performance and key metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsLoading ? (
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

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-4">
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="clicks">Clicks</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>
                Daily views for the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {chartLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      name="Views"
                    />
                    <Area
                      type="monotone"
                      dataKey="previousValue"
                      stroke="hsl(var(--muted-foreground))"
                      fillOpacity={0.3}
                      fill="hsl(var(--muted))"
                      name="Previous Period"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>
                Daily clicks for the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {chartLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Clicks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Over Time</CardTitle>
              <CardDescription>
                Daily conversion rates for the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {chartLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      name="Conversion %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <CardDescription>
            Your best performing content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topPerformersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topPerformers?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.views.toLocaleString()} views • {item.clicks.toLocaleString()} clicks
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {item.conversion}% conversion
                  </Badge>
                </div>
              ))}
            </div>
          )}
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
