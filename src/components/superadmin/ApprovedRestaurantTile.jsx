// src/components/superadmin/ApprovedRestaurantTile.jsx
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const ApprovedRestaurantTile = ({ restaurant, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-3 min-h-[86px] flex items-center gap-3">
      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">🍽️</div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="truncate">
            <p className="font-semibold text-sm leading-tight truncate">{restaurant.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{restaurant.owner} • {restaurant.plan || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{restaurant.orders ?? 0}</span>
            <span className="text-[11px]">orders</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-sm">{restaurant.revenue ?? '₹0'}</span>
            <span className="text-[11px]">revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedRestaurantTile;
