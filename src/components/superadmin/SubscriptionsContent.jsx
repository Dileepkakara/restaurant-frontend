// src/components/superadmin/SubscriptionsContent.jsx
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit } from "lucide-react";
import PlanCard from "./PlanCard";

const SubscriptionsContent = ({ plans, openPlanModal, onDeletePlan }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Subscription Plans</h3>
                <div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => openPlanModal(null)}>
                        Add Plan
                    </Button>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <PlanCard key={index} plan={plan} onEdit={() => openPlanModal(plan)} onDelete={() => onDeletePlan(plan)} />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionsContent;

