import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Eye, Users, TrendingUp, Globe, RefreshCw, Loader2, Calendar, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

export default function Analytics() {
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track your business card performance</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time card views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Unique IP addresses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Created</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.viewsByCard.length}</div>
              <p className="text-xs text-muted-foreground">Active business cards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Views/Card</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.viewsByCard.length > 0
                  ? Math.round(analytics.totalViews / analytics.viewsByCard.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Average engagement</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cards">By Card</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="recent">Recent Views</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Views Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.viewsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.viewsByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Views"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Referrers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topReferrers.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topReferrers.map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{referrer.referrer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{referrer.views} views</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(referrer.views / analytics.totalViews) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No referrer data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            {/* Views by Card */}
            <Card>
              <CardHeader>
                <CardTitle>Views by Card</CardTitle>
                <CardDescription>Performance of each business card</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.viewsByCard.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analytics.viewsByCard}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cardName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#8884d8" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No cards with views yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Card Performance</CardTitle>
                <CardDescription>Detailed breakdown by card</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.viewsByCard.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.viewsByCard
                      .sort((a, b) => b.views - a.views)
                      .map((card, index) => (
                        <div
                          key={card.cardId}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{card.cardName}</p>
                              <p className="text-sm text-muted-foreground">
                                {((card.views / analytics.totalViews) * 100).toFixed(1)}% of total views
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{card.views}</p>
                            <p className="text-sm text-muted-foreground">views</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No card data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            {/* Views by Location */}
            <Card>
              <CardHeader>
                <CardTitle>Views by Location</CardTitle>
                <CardDescription>Geographic distribution of visitors</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.viewsByLocation.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.viewsByLocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ country, percent }) =>
                            `${country}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="views"
                        >
                          {analytics.viewsByLocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                      {analytics.viewsByLocation.map((location, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{location.country}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{location.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No location data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How visitors find your cards</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topReferrers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.topReferrers.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="referrer" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#82ca9d" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No traffic source data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Views</CardTitle>
                <CardDescription>Latest 50 card views</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.recentViews.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentViews.map((view) => (
                      <div
                        key={view.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{view.card_name || 'Unknown Card'}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(view.viewed_at), 'MMM dd, yyyy HH:mm:ss')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{view.ip_address || 'Unknown IP'}</p>
                          {view.referrer && (
                            <p className="text-xs">
                              from {new URL(view.referrer).hostname}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent views
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
