import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Download,
  Loader2,
  FolderOpen,
  EyeIcon
} from "lucide-react";
import { API } from '@/config/api';

function DashboardHomePage() {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'x-jwt-bearer': token,
        'Content-Type': 'application/json',
      };

      const [cardsRes, productsRes, activitiesRes, documentsRes, categoriesRes] = await Promise.all([
        fetch(API.DASHBOARD_CARDS, { headers }),
        fetch(`${API.DASHBOARD_RECENT_PRODUCTS}?limit=5`, { headers }),
        fetch(`${API.DASHBOARD_RECENT_ACTIVITIES}?limit=10`, { headers }),
        fetch(`${API.DASHBOARD_RECENT_DOCUMENTS}?limit=4`, { headers }),
        fetch(API.DASHBOARD_PRODUCTS_BY_CATEGORY, { headers }),
      ]);

      const [cards, products, activities, documents, categories] = await Promise.all([
        cardsRes.json(),
        productsRes.json(),
        activitiesRes.json(),
        documentsRes.json(),
        categoriesRes.json(),
      ]);

      if (cards.success) setCardData(cards.data);
      if (products.success) setRecentProducts(products.data);
      if (activities.success) setRecentActivities(activities.data);
      if (documents.success) setRecentDocuments(documents.data);
      if (categories.success) setProductsByCategory(categories.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString();
  };

  const getActivityIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) 
      return <Plus className="h-4 w-4 text-green-600" />;
    if (actionLower.includes('upload') || actionLower.includes('document')) 
      return <FileText className="h-4 w-4 text-blue-600" />;
    if (actionLower.includes('login') || actionLower.includes('user')) 
      return <Users className="h-4 w-4 text-purple-600" />;
    if (actionLower.includes('update') || actionLower.includes('edit')) 
      return <Activity className="h-4 w-4 text-orange-600" />;
    if (actionLower.includes('qr')) 
      return <BarChart3 className="h-4 w-4 text-indigo-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getCategoryColor = (index) => {
    const colors = [
      'hsl(220, 70%, 50%)',
      'hsl(160, 70%, 50%)',
      'hsl(30, 70%, 50%)',
      'hsl(280, 70%, 50%)',
      'hsl(10, 70%, 50%)',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your products.</p>
        </div>
        <div className="flex gap-2">
          <Link to='/dashboard/tanent-products'>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link to='/dashboard/document-center'>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      {cardData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardData.totalProducts?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`flex items-center ${cardData.productChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cardData.productChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(cardData.productChangePercentage)}%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardData.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">Registered users</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardData.totalDocuments || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 flex items-center">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {cardData.totalFolders || 0} folders
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cardData.maxProductStatus || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                Most common product status
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Latest products added to the system</CardDescription>
              </div>
              <Link to='/dashboard/tanent-products'>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products yet</p>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category} • {product.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        style={{ 
                          backgroundColor: `${product.status_color}20`,
                          color: product.status_color,
                          borderColor: product.status_color
                        }}
                        className="border"
                      >
                        {product.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatTimeAgo(product.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No activities yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Distribution of products across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {productsByCategory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No categories yet</p>
            ) : (
              <div className="space-y-4">
                {productsByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getCategoryColor(index) }}
                      ></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: getCategoryColor(index)
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{item.count}</span>
                      <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Latest uploaded documents</CardDescription>
              </div>
              <Link to='/dashboard/document-center'>
                <Button variant="outline" size="sm">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentDocuments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No documents yet</p>
            ) : (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} • {formatTimeAgo(doc.uploaded_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      {doc.type.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Status Distribution */}
      {cardData && cardData.productStatuses && cardData.productStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Status Distribution</CardTitle>
            <CardDescription>Overview of products by their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {cardData.productStatuses.map((status, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${status.color_hex}20` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color_hex }}
                    ></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{status.count}</p>
                    <p className="text-sm text-muted-foreground">{status.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DashboardHomePage;
