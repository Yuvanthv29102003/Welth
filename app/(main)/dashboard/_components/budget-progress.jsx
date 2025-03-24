"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { updateBudget } from "@/actions/budget";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget ? initialBudget.amount : ""
  );
  const router = useRouter();

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    try {
      setIsLoading(true);
      const result = await updateBudget(parseFloat(newBudget));
      if (result.success) {
        toast.success("Budget updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update budget");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(initialBudget ? initialBudget.amount : "");
    setIsEditing(false);
  };

  const getProgressColor = (percent) => {
    if (percent >= 90) return "from-red-500 to-red-600";
    if (percent >= 75) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="h-8 w-8 bg-green-500/10 hover:bg-green-500/20 text-green-600"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `${formatCurrency(currentExpenses)} of ${formatCurrency(
                        initialBudget.amount
                      )} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 hover:bg-gray-500/10"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {initialBudget && (
          <div className="space-y-2">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all bg-gradient-to-r",
                  getProgressColor(percentUsed)
                )}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{percentUsed.toFixed(1)}% used</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
