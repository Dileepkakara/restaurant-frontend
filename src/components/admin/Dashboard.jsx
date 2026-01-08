// src/components/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    TrendingUp,
    Clock,
    DollarSign,
    ChevronRight,
    ShoppingCart,
    UtensilsCrossed,
    TrendingUp as TrendingUpIcon,
    Download,
    RefreshCw
} from "lucide-react";
import * as analyticsApi from "@/api/analyticsApi";
import { toast } from "sonner";

const stats = [
    { label: "Today's Revenue", value: "₹24,850", change: "+12%", icon: DollarSign, color: "bg-success" },
    { label: "Active Orders", value: "12", change: "+3", icon: ShoppingCart, color: "bg-primary" },
    { label: "Items Served", value: "156", change: "+28", icon: UtensilsCrossed, color: "bg-secondary" },
    { label: "Avg Order Time", value: "18 min", change: "-2 min", icon: Clock, color: "bg-gold" },
];

const orders = [
    { id: "#ORD-001", table: "Table 5", items: "Margherita Pizza, Garlic Bread", amount: "₹598", time: "2 min ago", status: "Preparing" },
    { id: "#ORD-002", table: "Table 3", items: "Fettuccine Alfredo, Caesar Salad", amount: "₹628", time: "5 min ago", status: "Ready" },
    { id: "#ORD-003", table: "Table 7", items: "BBQ Chicken Pizza", amount: "₹459", time: "8 min ago", status: "Pending" },
    { id: "#ORD-004", table: "Table 2", items: "Grilled Chicken Salad, Chocolate Brownie", amount: "₹478", time: "12 min ago", status: "Preparing" },
];

const topSellingItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        orders: 156,
        price: "₹399",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=80&h=80&fit=crop&crop=center", // Pizza
        growth: "+12%"
    },
    {
        id: 2,
        name: "Fettuccine Alfredo",
        orders: 124,
        price: "₹349",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop&crop=center", // Pasta
        growth: "+8%"
    },
    {
        id: 3,
        name: "Grilled Chicken Salad",
        orders: 80,
        price: "₹279",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center", // Salad
        growth: "+15%"
    },
    {
        id: 4,
        name: "BBQ Chicken Pizza",
        orders: 75,
        price: "₹459",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop&crop=center", // Pizza
        growth: "+5%"
    },
    {
        id: 5,
        name: "Chocolate Brownie",
        orders: 52,
        price: "₹199",
        image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=80&h=80&fit=crop&crop=center", // Dessert
        growth: "+22%"
    },
];

// Food emoji fallback based on item name
const getFoodEmoji = (name) => {
    if (name.includes('Pizza')) return '🍕';
    if (name.includes('Pasta') || name.includes('Alfredo')) return '🍝';
    if (name.includes('Salad')) return '🥗';
    if (name.includes('Burger')) return '🍔';
    if (name.includes('Bread')) return '🍞';
    if (name.includes('Brownie') || name.includes('Dessert')) return '🍰';
    return '🍽️';
};

// Get food image based on item name
const getFoodImage = (name) => {
    if (name.includes('Pizza')) return 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=80&h=80&fit=crop&crop=center';
    if (name.includes('Pasta') || name.includes('Alfredo')) return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop&crop=center';
    if (name.includes('Salad')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center';
    if (name.includes('Burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop&crop=center';
    if (name.includes('Bread')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop&crop=center';
    if (name.includes('Brownie') || name.includes('Dessert')) return 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=80&h=80&fit=crop&crop=center';
    return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop&crop=center'; // Default food image
};

const Dashboard = () => {
    const [dashboardStats, setDashboardStats] = useState({
        todaysRevenue: 0,
        activeOrders: 0,
        itemsServed: 0,
        avgOrderTime: 0,
        recentOrders: []
    });
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Get restaurant ID (using seeded restaurant for demo)
    const getRestaurantId = () => {
        // Prefer the logged-in user's restaurant (stored in localStorage under 'rb_user')
        try {
            const raw = localStorage.getItem('rb_user');
            if (raw) {
                const user = JSON.parse(raw);
                if (user && user.restaurant) {
                    // `restaurant` may be an id string or an object with `_id`/`id`
                    if (typeof user.restaurant === 'string') return user.restaurant;
                    if (user.restaurant._id) return user.restaurant._id;
                    if (user.restaurant.id) return user.restaurant.id;
                }
            }
        } catch (e) {
            console.error('Error reading stored user for restaurant id:', e);
        }

        // Fallback seeded restaurant id for demo
        return '6748b8f8e4b0a1b2c3d4e5f6';
    };

    // Load dashboard data
    const loadDashboardData = async () => {
        const restaurantId = getRestaurantId();
        if (!restaurantId) {
            setLoading(false);
            return;
        }

        try {
            setRefreshing(true);

            // Load dashboard stats and top selling items in parallel
            const [statsResponse, topSellingResponse] = await Promise.allSettled([
                analyticsApi.getDashboardStats(restaurantId),
                analyticsApi.getTopSellingItems(restaurantId)
            ]);

            if (statsResponse.status === 'fulfilled') {
                setDashboardStats(statsResponse.value);
            } else {
                console.error('Failed to load dashboard stats:', statsResponse.reason);
                toast.error('Failed to load dashboard statistics');
            }

            if (topSellingResponse.status === 'fulfilled') {
                setTopSellingItems(topSellingResponse.value);
            } else {
                console.error('Failed to load top selling items:', topSellingResponse.reason);
                toast.error('Failed to load top selling items');
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadDashboardData();

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(loadDashboardData, 30000);

        return () => clearInterval(interval);
    }, []);

    // Handle export report
    const handleExportReport = async () => {
        const restaurantId = getRestaurantId();
        if (!restaurantId) {
            toast.error('No restaurant selected');
            return;
        }

        try {
            const response = await analyticsApi.exportAnalyticsReport(restaurantId);

            // Create download link
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `restaurant-analytics-${restaurantId}-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Report exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export report');
        }
    };

    // Format stats for display
    const formatStats = () => {
        return [
            {
                label: "Today's Revenue",
                value: `₹${dashboardStats.todaysRevenue.toLocaleString()}`,
                change: "+12%", // This would need historical comparison
                icon: DollarSign,
                color: "bg-success"
            },
            {
                label: "Active Orders",
                value: dashboardStats.activeOrders.toString(),
                change: "+3", // This would need historical comparison
                icon: ShoppingCart,
                color: "bg-primary"
            },
            {
                label: "Items Served",
                value: dashboardStats.itemsServed.toString(),
                change: "+28", // This would need historical comparison
                icon: UtensilsCrossed,
                color: "bg-secondary"
            },
            {
                label: "Avg Order Time",
                value: `${dashboardStats.avgOrderTime} min`,
                change: "-2 min", // This would need historical comparison
                icon: Clock,
                color: "bg-gold"
            },
        ];
    };

    const onViewAllOrders = () => {
        // Navigate to orders page
        console.log("View all orders");
    };

    const onViewTopSelling = () => {
        // Navigate to menu management
        console.log("View top selling items");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Welcome back, Spice Garden Admin</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs sm:text-sm"
                        onClick={handleExportReport}
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs sm:text-sm"
                        onClick={loadDashboardData}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                        <span className="sm:hidden">Refresh</span>
                    </Button>
                    <Button size="sm" className="gap-2 text-xs sm:text-sm">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Order</span>
                        <span className="sm:hidden">New</span>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {formatStats().map((stat) => (
                    <div key={stat.label} className="bg-card border border-border rounded-xl p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <Badge variant={stat.change.includes("+") ? "success" : "default"} className="text-xs">
                                {stat.change}
                            </Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Section */}
                <div className="bg-card border border-border rounded-xl">
                    <div className="p-4 sm:p-6 border-b border-border">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-lg sm:text-xl font-bold">Recent Orders</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onViewAllOrders}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="hidden sm:table-header-group">
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Table</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardStats.recentOrders.slice(0, 4).map((order) => (
                                    <>
                                        <tr key={order.id} className="border-b border-border last:border-0 hidden sm:table-row">
                                            <td className="p-4">
                                                <div className="font-medium">{order.id.substring(0, 8)}...</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{order.table}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                                    {order.items}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">{order.amount}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-muted-foreground">{order.time}</div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant={
                                                        order.status === "Pending" ? "default" :
                                                            order.status === "Preparing" ? "secondary" :
                                                                order.status === "Ready" ? "success" : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </td>
                                        </tr>

                                        <div key={`mobile-${order.id}`} className="sm:hidden p-4 border-b border-border last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-medium">{order.id.substring(0, 8)}...</div>
                                                    <div className="text-sm text-muted-foreground mt-1">{order.table}</div>
                                                </div>
                                                <Badge
                                                    variant={
                                                        order.status === "Pending" ? "default" :
                                                            order.status === "Preparing" ? "secondary" :
                                                                order.status === "Ready" ? "success" : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground mb-2">{order.items}</div>
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold">{order.amount}</div>
                                                <div className="text-sm text-muted-foreground">{order.time}</div>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Items Section - ONLY FOOD ITEMS */}
                <div className="bg-card border border-border rounded-xl">
                    <div className="p-4 sm:p-6 border-b border-border">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-lg sm:text-xl font-bold">Top Selling Items</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onViewTopSelling}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View Menu
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                                        <div className="w-7 h-7 bg-muted rounded-full"></div>
                                        <div className="w-10 h-10 bg-muted rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-muted rounded mb-2"></div>
                                            <div className="h-3 bg-muted rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topSellingItems.slice(0, 5).map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                        {/* Rank Badge */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                                    index === 2 ? 'bg-amber-100 text-amber-800' :
                                                        'bg-muted text-muted-foreground'
                                                }`}>
                                                <span className="font-bold text-xs sm:text-sm">{index + 1}</span>
                                            </div>
                                        </div>

                                        {/* Food Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-muted relative">
                                                <img
                                                    src={getFoodImage(item.name)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        const emoji = getFoodEmoji(item.name);
                                                        e.target.parentElement.className = `w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center`;
                                                        e.target.parentElement.innerHTML = `<span class="text-lg">${emoji}</span>`;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-foreground truncate text-sm sm:text-base">{item.name}</h3>
                                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200 hidden sm:flex items-center gap-1">
                                                    <TrendingUpIcon className="w-3 h-3" />
                                                    {item.growth}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs sm:text-sm text-muted-foreground">
                                                    {item.orders} orders
                                                </div>
                                                <div className="font-bold text-foreground text-sm sm:text-base">
                                                    {item.price}
                                                </div>
                                            </div>
                                            <div className="sm:hidden mt-1">
                                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                                                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                                                    {item.growth}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Simple Mobile View */}
                        <div className="sm:hidden mt-6 space-y-3">
                            {topSellingItems.slice(0, 3).map((item, index) => (
                                <div key={`mobile-${item.id}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={getFoodImage(item.name)}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    const emoji = getFoodEmoji(item.name);
                                                    e.target.parentElement.className = `w-10 h-10 rounded-lg bg-muted flex items-center justify-center`;
                                                    e.target.parentElement.innerHTML = `<span class="text-lg">${emoji}</span>`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm text-foreground truncate">{item.name}</span>
                                            <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">{item.orders} orders</span>
                                            <span className="font-bold text-sm text-foreground">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;