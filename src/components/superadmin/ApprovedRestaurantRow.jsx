import { Edit, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApprovedRestaurantRow = ({ restaurant, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-4 px-4 py-3 border-b hover:bg-gray-50">
      
      {/* Image */}
      <div className="col-span-1">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="col-span-3 font-medium">
        {restaurant.name}
      </div>

      {/* Owner */}
      <div className="col-span-2 text-sm text-gray-600">
        {restaurant.owner}
      </div>

      {/* Plan */}
      <div className="col-span-2 text-sm">
        {restaurant.plan}
      </div>

      {/* Orders */}
      <div className="col-span-2 text-sm">
        {restaurant.orders}
      </div>

      {/* Revenue */}
      <div className="col-span-1 text-sm">
        {restaurant.revenue}
      </div>

      {/* Actions */}
      <div className="col-span-1 flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default ApprovedRestaurantRow;
