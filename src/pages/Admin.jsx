// Admin.jsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Tag,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  QrCode,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { menuItems as initialMenuItems } from "@/data/menuData";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { TableManagement } from "@/components/admin/TableManagement";
import Dashboard from "@/components/admin/Dashboard";
import { LiveOrders } from "@/components/admin/LiveOrders";
import * as menuApi from "@/api/menuApi";
import * as tableApi from "@/api/tableApi";
import * as orderApi from "@/api/orderApi";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ShoppingCart, label: "Live Orders", id: "orders", badge: 5 },
  { icon: UtensilsCrossed, label: "Menu Management", id: "menu" },
  { icon: QrCode, label: "Table Management", id: "tables" },
  { icon: Tag, label: "Offers & Promotions", id: "offers" },
  { icon: Users, label: "Staff & Roles", id: "staff" },
  { icon: BarChart3, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// Orders data from the image reference
const initialOrders = [
  {
    id: "MFO01",
    table: "Table 5",
    items: "Margherita Pizza, Caesar Salad, Garlic Bread",
    amount: "₹478",
    time: "2 min ago",
    status: "Pending"
  },
  {
    id: "MFO02",
    table: "Table 3",
    items: "Chicken Burger x2, Pasta Alfredo, Coke",
    amount: "₹647",
    time: "8 min ago",
    status: "Preparing"
  },
  {
    id: "MFO03",
    table: "Table 8",
    items: "Grilled Salmon, Mashed Potatoes",
    amount: "₹449",
    time: "15 min ago",
    status: "Ready"
  },
  {
    id: "MFO04",
    table: "Table 1",
    items: "Veggie Wrap, Caesar Salad, Smoothie",
    amount: "₹338",
    time: "25 min ago",
    status: "Completed"
  },
  {
    id: "MFO05",
    table: "Table 12",
    items: "Pasta Alfredo, Garlic Bread, Tiramisu",
    amount: "₹399",
    time: "1 min ago",
    status: "Pending"
  },
  {
    id: "MFO06",
    table: "Table 7",
    items: "Chicken Burger, French Fries",
    amount: "₹289",
    time: "5 min ago",
    status: "Preparing"
  },
  {
    id: "MFO07",
    table: "Table 9",
    items: "Veggie Pizza, Coke",
    amount: "₹359",
    time: "3 min ago",
    status: "Pending"
  },
];

const initialTables = [
  { id: "1", number: 1, capacity: 4, status: "available", qrCode: `${window.location.origin}/menu?table=1` },
  { id: "2", number: 2, capacity: 2, status: "occupied", qrCode: `${window.location.origin}/menu?table=2` },
  { id: "3", number: 3, capacity: 6, status: "reserved", qrCode: `${window.location.origin}/menu?table=3` },
  { id: "4", number: 4, capacity: 4, status: "available", qrCode: `${window.location.origin}/menu?table=4` },
  { id: "5", number: 5, capacity: 8, status: "occupied", qrCode: `${window.location.origin}/menu?table=5` },
];

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuItemsList, setMenuItemsList] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get restaurant ID from localStorage (assuming user data is stored there)
  const getRestaurantId = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('rb_user') || '{}');
      const restaurant = userData.restaurant;
      if (!restaurant) {
        // Fallback: if no restaurant assigned, use the default seeded restaurant
        console.warn('No restaurant assigned to user, using default restaurant');
        return '6748b8f8e4b0a1b2c3d4e5f6'; // Default seeded restaurant ID
      }

      // Handle both cases: restaurant as ObjectId string or as populated object
      if (typeof restaurant === 'string') {
        return restaurant;
      } else if (restaurant && restaurant._id) {
        return restaurant._id;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Get relative time string
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Load menu items from API
  const loadMenuItems = async () => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
      setError('No restaurant assigned to your account. Please contact support or try logging in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const items = await menuApi.getMenuItems(restaurantId);
      setMenuItemsList(items);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load tables from API
  const loadTables = async () => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
      setError('No restaurant assigned to your account. Please contact support or try logging in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const tablesData = await tableApi.getTables(restaurantId);
      setTables(tablesData);
    } catch (err) {
      setError(err.message || 'Failed to load tables');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load orders from API
  const loadOrders = async () => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
      setError('No restaurant assigned to your account. Please contact support or try logging in again.');
      return;
    }

    setOrdersLoading(true);
    setError(null);
    try {
      const ordersData = await orderApi.getOrders(restaurantId);
      // Transform backend data to match frontend format
      const transformedOrders = ordersData.map(order => ({
        id: order._id,
        table: `Table ${order.table.tableNumber}`,
        items: order.items.map(item => `${item.menuItem.name} x${item.quantity}`).join(', '),
        amount: `₹${order.totalAmount}`,
        time: getRelativeTime(new Date(order.createdAt)),
        status: order.status
      }));
      setOrders(transformedOrders);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem('rb_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load menu items on component mount
  useEffect(() => {
    if (activeTab === 'menu') {
      loadMenuItems();
    }
  }, [activeTab]);

  // Load tables when tables tab is active
  useEffect(() => {
    if (activeTab === 'tables') {
      loadTables();
    }
  }, [activeTab]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  // Menu CRUD operations
  const handleAddMenuItem = async (item) => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
      setError('No restaurant assigned to your account. Please contact support or try logging in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newItem = await menuApi.createMenuItem(restaurantId, item);
      setMenuItemsList((prev) => [...prev, newItem]);
    } catch (err) {
      setError(err.message || 'Failed to add menu item');
      console.error('Error adding menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMenuItem = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await menuApi.updateMenuItem(item._id || item.id, item);
      setMenuItemsList((prev) =>
        prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
      );
    } catch (err) {
      setError(err.message || 'Failed to update menu item');
      console.error('Error updating menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await menuApi.deleteMenuItem(id);
      setMenuItemsList((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Table CRUD operations
  const handleAddTable = async (table) => {
    const restaurantId = getRestaurantId();
    if (!restaurantId) {
      setError('No restaurant assigned to your account. Please contact support or try logging in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newTable = await tableApi.createTable(restaurantId, table);
      setTables((prev) => [...prev, newTable]);
    } catch (err) {
      setError(err.message || 'Failed to add table');
      console.error('Error adding table:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTable = async (table) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTable = await tableApi.updateTable(table._id || table.id, table);
      setTables((prev) =>
        prev.map((t) => (t._id === updatedTable._id ? updatedTable : t))
      );
    } catch (err) {
      setError(err.message || 'Failed to update table');
      console.error('Error updating table:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await tableApi.deleteTable(id);
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete table');
      console.error('Error deleting table:', err);
    } finally {
      setLoading(false);
    }
  };

  // Order actions
  const handleOrderAction = async (orderId, action) => {
    let newStatus = '';

    switch (action) {
      case "Accept":
        newStatus = "Preparing";
        break;
      case "Mark Ready":
        newStatus = "Ready";
        break;
      case "Complete":
        newStatus = "Completed";
        break;
      default:
        return;
    }

    try {
      await orderApi.updateOrderStatus(orderId, { status: newStatus });
      // Update local state after successful API call
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_user');
    window.location.href = '/admin/login';
  };

  // Get user initials
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';
  };

  const handleSidebarClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sm sm:text-base">Spice Garden</h1>
                <p className="text-xs text-muted-foreground">Restaurant Admin</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge && (
                <Badge variant={activeTab === item.id ? "gold" : "default"} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full text-sm">
              Back to Landing
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search orders, items..."
                  className="input-field pl-10 w-48 lg:w-64 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {getInitials(user?.name)}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {user?.name || 'Restaurant Admin'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {user?.name || 'Restaurant Admin'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || 'admin@example.com'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {activeTab === "dashboard" && (
            <Dashboard orders={orders} menuItems={menuItemsList} />
          )}

          {activeTab === "orders" && (
            <LiveOrders
              orders={orders}
              onOrderAction={handleOrderAction}
              onRefresh={loadOrders}
              loading={ordersLoading}
            />
          )}

          {activeTab === "menu" && (
            <div>
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-4 p-4 bg-muted rounded-lg text-center">
                  Loading menu items...
                </div>
              )}
              <MenuManagement
                items={menuItemsList.map(item => ({
                  ...item,
                  id: item._id || item.id // Normalize ID for frontend compatibility
                }))}
                onAddItem={handleAddMenuItem}
                onUpdateItem={handleUpdateMenuItem}
                onDeleteItem={handleDeleteMenuItem}
              />
            </div>
          )}

          {activeTab === "tables" && (
            <div>
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-4 p-4 bg-muted rounded-lg text-center">
                  Loading tables...
                </div>
              )}
              <TableManagement
                tables={tables.map(table => ({
                  ...table,
                  id: table._id || table.id // Normalize ID for frontend compatibility
                }))}
                onAddTable={handleAddTable}
                onUpdateTable={handleUpdateTable}
                onDeleteTable={handleDeleteTable}
              />
            </div>
          )}

          {activeTab !== "dashboard" && activeTab !== "orders" && activeTab !== "menu" && activeTab !== "tables" && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                {sidebarItems.find((i) => i.id === activeTab)?.icon && (
                  <div className="w-8 h-8 text-muted-foreground">
                    {(() => {
                      const Icon = sidebarItems.find((i) => i.id === activeTab)?.icon;
                      return Icon ? <Icon className="w-full h-full" /> : null;
                    })()}
                  </div>
                )}
              </div>
              <h2 className="font-display text-xl font-bold mb-2 capitalize">{activeTab.replace("-", " ")}</h2>
              <p className="text-muted-foreground">This section is coming soon</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Admin;