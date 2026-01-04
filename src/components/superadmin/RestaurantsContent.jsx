// src/components/superadmin/RestaurantsContent.jsx
import { Button } from "@/components/ui/button";
import { Search, Plus, Building2, Edit, Trash2, Power } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import ApprovedRestaurantTile from "./ApprovedRestaurantTile";
import ApprovedRestaurantRow from "./ApprovedRestaurantRow";

const RestaurantsContent = ({
    pendingRestaurants,
    restaurants,
    searchQuery,
    setSearchQuery,
    openRestaurantModal,
    toggleRestaurantStatus,
    deleteRestaurant,
    approveRestaurant
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900"
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    onClick={() => openRestaurantModal()}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Restaurant
                </Button>
            </div>

            {pendingRestaurants && pendingRestaurants.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-3">Pending Approvals</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {pendingRestaurants.map(r => (
                            <RestaurantCard
                                key={r.id || r._id}
                                restaurant={r}
                                onEdit={() => openRestaurantModal(r)}
                                onDelete={() => deleteRestaurant(r.id || r._id)}
                                onApprove={() => approveRestaurant(r._id || r.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <h4 className="font-semibold mb-3">Approved Restaurants</h4>
            <h4 className="font-semibold mb-3">Approved Restaurants</h4>

<div className="bg-white rounded-xl border overflow-hidden">
  
  {/* Header */}
  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 text-sm font-semibold">
    <div className="col-span-1">Image</div>
    <div className="col-span-3">Name</div>
    <div className="col-span-2">Owner</div>
    <div className="col-span-2">Plan</div>
    <div className="col-span-2">Orders</div>
    <div className="col-span-1">Revenue</div>
    <div className="col-span-1">Actions</div>
  </div>

  {/* Rows */}
  {restaurants.map(r => (
    <ApprovedRestaurantRow
      key={r.id || r._id}
      restaurant={r}
      onEdit={() => openRestaurantModal(r)}
      onDelete={() => deleteRestaurant(r.id || r._id)}
    />
  ))}
</div>
        </div>
    );
};

export default RestaurantsContent;