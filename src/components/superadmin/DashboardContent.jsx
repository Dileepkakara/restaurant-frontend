// src/components/superadmin/DashboardContent.jsx
import { TrendingUp, Building2, Plus, ArrowUpRight, DollarSign, CheckCircle, Clock } from "lucide-react";

const DashboardContent = ({ stats, restaurants, pendingRestaurants = [] }) => {
    // Dynamic recent activities based on actual data
    const recentActivities = [
        ...pendingRestaurants.slice(0, 2).map(r => ({
            action: "New restaurant pending approval",
            name: r.name,
            time: "Just now",
            icon: Clock
        })),
        ...restaurants.slice(0, 2).map(r => ({
            action: "Restaurant approved",
            name: r.name,
            time: "Recently",
            icon: CheckCircle
        })),
        { action: "System initialized", name: "Platform ready", time: "Today", icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="rounded-xl border bg-white border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">Recent Restaurants</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {restaurants.slice(0, 4).map(r => (
                                <div key={r._id || r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{r.name}</p>
                                            <p className="text-sm text-gray-500">{r.owner?.name || r.owner || 'Owner'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        r.status === "approved" || r.approved ? "bg-green-100 text-green-800" :
                                        r.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-blue-100 text-blue-800"
                                    }`}>
                                        {r.status === "approved" || r.approved ? "Active" : r.status || "Active"}
                                    </span>
                                </div>
                            ))}
                            {restaurants.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No restaurants yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-white border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">Platform Activity</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <activity.icon className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.name}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;