// src/components/superadmin/PlanCard.jsx
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Trash2 } from "lucide-react";

const PlanCard = ({ plan, onEdit, onDelete }) => {
    return (
        <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm p-6">
            <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                    {plan.restaurants ?? 0} active restaurants
                </p>
            </div>
            <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                    </li>
                ))}
            </ul>
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </div>
        </div>
    );
};

export default PlanCard;