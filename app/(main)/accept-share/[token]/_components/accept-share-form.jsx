"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { acceptSharedExpense, declineSharedExpense } from "@/actions/shared-expense";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export function AcceptShareForm({ sharedExpense }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    try {
      setLoading(true);
      const result = await acceptSharedExpense(sharedExpense.id);
      if (result.success) {
        toast.success("Expense accepted successfully");
        router.push("/shared-expenses");
      } else {
        toast.error(result.error || "Failed to accept expense");
      }
    } catch (error) {
      toast.error("An error occurred while accepting the expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setLoading(true);
      const result = await declineSharedExpense(sharedExpense.id);
      if (result.success) {
        toast.success("Expense declined successfully");
        router.push("/shared-expenses");
      } else {
        toast.error(result.error || "Failed to decline expense");
      }
    } catch (error) {
      toast.error("An error occurred while declining the expense");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BarLoader className="mt-4" width={"100%"} color="#9333ea" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Shared By
            </h3>
            <p className="text-lg">
              {sharedExpense.owner.name || sharedExpense.owner.email}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="text-lg">{sharedExpense.transaction.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Date
            </h3>
            <p className="text-lg">
              {format(new Date(sharedExpense.transaction.date), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Category
            </h3>
            <p className="text-lg capitalize">{sharedExpense.transaction.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Your Share
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(sharedExpense.amountPerPerson)}
            </p>
          </div>
          {sharedExpense.message && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Message
              </h3>
              <p className="text-lg">{sharedExpense.message}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={loading}
            className="flex-1"
          >
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={loading} className="flex-1">
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 