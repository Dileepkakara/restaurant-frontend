// src/pages/SuperAdmin.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPendingRestaurants, approveRestaurant as apiApproveRestaurant, getApprovedRestaurants, createRestaurant as apiCreateRestaurant, updateRestaurant as apiUpdateRestaurant, deleteRestaurant as apiDeleteRestaurant } from '@/api/restaurantApi';
import { listPlans as apiListPlans, createPlan as apiCreatePlan, updatePlan as apiUpdatePlan, deletePlan as apiDeletePlan } from '@/api/subscriptionApi';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Users,
  TrendingUp,
  DollarSign,
  Ticket,
  Home,
  Menu as MenuIcon
} from "lucide-react";

// Import SuperAdmin components
import {
  Sidebar,
  Header,
  DashboardContent,
  RestaurantsContent,
  SubscriptionsContent,
  BillingContent,
  AnalyticsContent,
  SupportContent,
  SettingsContent,
  RestaurantModal,
  PlanModal,
  DeleteModal
} from "@/components/superadmin";

// Define constants for tabs
const TABS = {
  DASHBOARD: "dashboard",
  RESTAURANTS: "restaurants",
  SUBSCRIPTIONS: "subscriptions",
  BILLING: "billing",
  ANALYTICS: "analytics",
  SUPPORT: "support",
  SETTINGS: "settings"
};

const initialPlans = [];
const mockRestaurants = [];


const supportTickets = [
  { id: "TK001", restaurant: "Pizza Paradise", issue: "Payment gateway not working", status: "open", time: "2 hours ago" },
  { id: "TK002", restaurant: "Spice Route", issue: "Need help with menu setup", status: "in-progress", time: "5 hours ago" },
  { id: "TK003", restaurant: "The Urban Kitchen", issue: "QR codes not generating", status: "resolved", time: "1 day ago" },
];

// moved to top

export default function SuperAdminPortal() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [restaurants, setRestaurants] = useState([]); // approved restaurants
  const [pendingRestaurants, setPendingRestaurants] = useState([]); // pending approval
  const [plans, setPlans] = useState(initialPlans);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Restaurant Modal State
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    plan: "Starter"
  });

  // Plan Modal State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    features: ""
  });

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toggleRestaurantStatus = async (id) => {
    try {
      const target = restaurants.find(r => r.id === id || r._id === id);
      if (!target) return;
      const newStatus = target.status === 'active' ? 'suspended' : 'active';
      await apiUpdateRestaurant(target._id || target.id, { status: newStatus });
      setRestaurants(prev => prev.map(r => (r.id === id || r._id === id) ? { ...r, status: newStatus } : r));
    } catch (e) {
      console.error('Failed to toggle status', e);
      alert('Failed to update status');
    }
  };

  const fetchApproved = async () => {
    try {
      const list = await getApprovedRestaurants();
      const normalized = list.map(r => ({
        id: r._id || r.id,
        _id: r._id || r.id,
        name: r.name,
        owner: (r.owner && (r.owner.name || r.owner)) || '',
        email: r.owner?.email || '',
        phone: r.phone || '',
        address: r.address || '',
        image: r.logo?.url || r.avatar?.url || r.image || '',
        plan: r.plan || 'N/A',
        status: r.status || 'active',
        orders: r.orders || 0,
        revenue: r.revenue || '₹0'
      }));
      setRestaurants(normalized);
    } catch (e) {
      console.error('Failed to fetch approved restaurants', e.message || e);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await getPendingRestaurants();
      const list = Array.isArray(res) ? res : res || [];
      const normalized = list.map(r => ({
        id: r._id || r.id,
        _id: r._id || r.id,
        name: r.name,
        owner: (r.owner && (r.owner.name || r.owner)) || '',
        email: r.owner?.email || '',
        phone: r.phone || '',
        address: r.address || '',
        image: r.logo?.url || r.avatar?.url || r.image || '',
        plan: r.plan || 'N/A',
        status: 'pending',
        orders: r.orders || 0,
        revenue: r.revenue || '₹0'
      }));
      setPendingRestaurants(normalized);
    } catch (e) {
      console.error('Failed to fetch pending restaurants', e.message || e);
    }
  };

  const fetchPlans = async () => {
    try {
      const list = await apiListPlans();
      const normalized = list.map(p => ({ id: p._id, name: p.name, price: `₹${p.price}`, features: p.features || [], raw: p }));
      setPlans(normalized);
    } catch (e) {
      console.error('Failed to fetch plans', e.message || e);
    }
  };

  useEffect(() => {
    fetchApproved();
    fetchPending();
    fetchPlans();
  }, []);

  const approveRestaurant = async (id) => {
    if (!confirm('Approve this restaurant?')) return;
    try {
      await apiApproveRestaurant(id);
      // refresh lists
      await fetchPending();
      await fetchApproved();
      alert('Restaurant approved.');
    } catch (e) {
      console.error(e);
      alert('Failed to approve restaurant.');
    }
  };

  // Restaurant CRUD
  const openRestaurantModal = (restaurant) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setRestaurantForm({
        name: restaurant.name,
        owner: restaurant.owner,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        image: restaurant.image,
        plan: restaurant.plan
      });
    } else {
      setEditingRestaurant(null);
      setRestaurantForm({ name: "", owner: "", email: "", phone: "", address: "", image: "", plan: "Starter" });
    }
    setRestaurantModalOpen(true);
  };

  const saveRestaurant = async () => {
    if (!restaurantForm.name || !restaurantForm.owner) {
      alert("Please fill in required fields: Name and Owner");
      return;
    }

    try {
      if (editingRestaurant) {
        const id = editingRestaurant._id || editingRestaurant.id;
        const body = {
          name: restaurantForm.name,
          address: restaurantForm.address,
          image: restaurantForm.image,
          ownerName: restaurantForm.owner,
          ownerEmail: restaurantForm.email,
          phone: restaurantForm.phone,
          plan: restaurantForm.plan
        };
        const updated = await apiUpdateRestaurant(id, body);
        setRestaurants(prev => prev.map(r => (r._id === updated._id || r.id === updated._id) ? ({
          id: updated._id,
          _id: updated._id,
          name: updated.name,
          owner: updated.owner?.name || restaurantForm.owner,
          email: updated.owner?.email || restaurantForm.email,
          phone: updated.phone || restaurantForm.phone,
          address: updated.address || restaurantForm.address,
          image: updated.logo?.url || restaurantForm.image,
          plan: updated.plan || restaurantForm.plan,
          status: updated.status || r.status
        }) : r));
        alert('Restaurant updated successfully!');
      } else {
        const body = {
          name: restaurantForm.name,
          address: restaurantForm.address,
          image: restaurantForm.image,
          ownerName: restaurantForm.owner,
          ownerEmail: restaurantForm.email,
          phone: restaurantForm.phone,
          plan: restaurantForm.plan
        };
        const created = await apiCreateRestaurant(body);
        const normalized = {
          id: created._id,
          _id: created._id,
          name: created.name,
          owner: created.owner?.name || restaurantForm.owner,
          email: created.owner?.email || restaurantForm.email,
          phone: created.phone || restaurantForm.phone,
          address: created.address || restaurantForm.address,
          image: created.logo?.url || restaurantForm.image,
          plan: created.plan || restaurantForm.plan,
          status: created.status || 'approved'
        };
        setRestaurants(prev => [normalized, ...prev]);
        alert('Restaurant added and approved successfully!');
      }
    } catch (e) {
      console.error('Failed to save restaurant', e);
      alert('Failed to save restaurant');
    }

    setRestaurantModalOpen(false);
  };

  const deleteRestaurant = (id) => {
    setDeleteTarget({ type: "restaurant", id });
    setDeleteModalOpen(true);
  };

  const onDeletePlan = (plan) => {
    setDeleteTarget({ type: 'plan', id: plan.id || plan._id || plan.raw?._id });
    setDeleteModalOpen(true);
  };

  // Plan CRUD
  const openPlanModal = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan?.name || '',
      price: plan?.price || '',
      features: plan?.features ? plan.features.join(", ") : ''
    });
    setPlanModalOpen(true);
  };

  const savePlan = async () => {
    if (!planForm.name || !planForm.price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const priceNumber = Number(planForm.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const features = planForm.features.split(',').map(f => f.trim()).filter(Boolean);

      if (editingPlan) {
        const id = editingPlan.id || editingPlan._id || editingPlan.raw?._id;
        const updated = await apiUpdatePlan(id, { name: planForm.name, price: priceNumber, features });
        setPlans(prev => prev.map(p => (p.id === (updated._id || id) ? ({ ...p, name: updated.name, price: `₹${updated.price}`, features: updated.features || [] }) : p)));
        alert('Plan updated successfully!');
      } else {
        const created = await apiCreatePlan({ name: planForm.name, price: priceNumber, features });
        setPlans(prev => [{ id: created._id, name: created.name, price: `₹${created.price}`, features: created.features || [], raw: created }, ...prev]);
        alert('Plan created successfully!');
      }
    } catch (e) {
      console.error('Failed to save plan', e);
      alert('Failed to save plan');
    }

    setPlanModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "restaurant") {
        await apiDeleteRestaurant(deleteTarget.id);
        setRestaurants(prev => prev.filter(r => (r.id !== deleteTarget.id && r._id !== deleteTarget.id)));
        setPendingRestaurants(prev => prev.filter(r => (r.id !== deleteTarget.id && r._id !== deleteTarget.id)));
        alert("Restaurant deleted successfully!");
      }

      if (deleteTarget.type === 'plan') {
        await apiDeletePlan(deleteTarget.id);
        setPlans(prev => prev.filter(p => p.id !== deleteTarget.id));
        alert('Plan deleted successfully!');
      }
    } catch (e) {
      console.error('Failed to delete', e);
      alert('Delete failed');
    }

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const navItems = [
    { id: TABS.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { id: TABS.RESTAURANTS, label: "Restaurants", icon: Building2, badge: pendingRestaurants.length },
    { id: TABS.SUBSCRIPTIONS, label: "Subscriptions", icon: CreditCard },
    { id: TABS.BILLING, label: "Billing", icon: DollarSign },
    { id: TABS.ANALYTICS, label: "Analytics", icon: BarChart3 },
    { id: TABS.SUPPORT, label: "Support", icon: Ticket, badge: supportTickets.filter(t => t.status === "open").length },
    { id: TABS.SETTINGS, label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Total Restaurants", value: "2,547", change: "+15%", icon: Building2 },
    { label: "Active Users", value: "45.2K", change: "+22%", icon: Users },
    { label: "Monthly Revenue", value: "₹45.6L", change: "+18%", icon: DollarSign },
    { label: "Total Orders", value: "1.2M", change: "+25%", icon: TrendingUp },
  ];

  const filteredApproved = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPending = pendingRestaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
      />

      <main className="flex-1 lg:ml-64">
        <Header activeTab={activeTab} setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
          {activeTab === TABS.DASHBOARD && (
            <DashboardContent stats={stats} restaurants={restaurants} />
          )}

          {activeTab === TABS.RESTAURANTS && (
            <RestaurantsContent
              pendingRestaurants={filteredPending}
              restaurants={filteredApproved}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openRestaurantModal={openRestaurantModal}
              toggleRestaurantStatus={toggleRestaurantStatus}
              deleteRestaurant={deleteRestaurant}
              approveRestaurant={approveRestaurant}
            />
          )}

          {activeTab === TABS.SUBSCRIPTIONS && (
            <SubscriptionsContent plans={plans} openPlanModal={openPlanModal} onDeletePlan={onDeletePlan} />
          )}

          {activeTab === TABS.BILLING && (
            <BillingContent />
          )}

          {activeTab === TABS.ANALYTICS && (
            <AnalyticsContent />
          )}

          {activeTab === TABS.SUPPORT && (
            <SupportContent supportTickets={supportTickets} />
          )}

          {activeTab === TABS.SETTINGS && (
            <SettingsContent />
          )}
        </div>
      </main>

      <RestaurantModal
        open={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
        editingRestaurant={editingRestaurant}
        restaurantForm={restaurantForm}
        setRestaurantForm={setRestaurantForm}
        saveRestaurant={saveRestaurant}
        plans={plans}
      />

      <PlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        editingPlan={editingPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        savePlan={savePlan}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}