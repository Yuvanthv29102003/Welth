"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { acceptSharedExpense, declineSharedExpense } from "@/actions/shared-expense";
import { formatCurrency } from "@/lib/utils";
import { BarLoader } from "react-spinners";

export function SharedExpensesList({ initialSharedExpenses = [] }) {
  const [expenses, setExpenses] = useState(initialSharedExpenses);
  const [loading, setLoading] = useState(false);

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      await acceptSharedExpense(id);
      setExpenses(expenses.map(expense => 
        expense.id === id ? { ...expense, status: 'ACCEPTED' } : expense
      ));
      toast.success("Expense accepted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to accept expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id) => {
    try {
      setLoading(true);
      await declineSharedExpense(id);
      setExpenses(expenses.map(expense => 
        expense.id === id ? { ...expense, status: 'DECLINED' } : expense
      ));
      toast.success("Expense declined successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to decline expense");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      ACCEPTED: "success",
      DECLINED: "destructive",
      EXPIRED: "secondary"
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-4">
          <BarLoader color="#9333ea" />
        </CardContent>
      </Card>
    );
  }

  if (!expenses?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground">No shared expenses found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {expense.transaction.description}
            </CardTitle>
            {getStatusBadge(expense.status)}
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formatCurrency(expense.amountPerPerson)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span>{format(new Date(expense.transaction.date), "PPP")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span>{expense.transaction.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shared by:</span>
                <span>{expense.owner.name || expense.owner.email}</span>
              </div>
              {expense.status === "PENDING" && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleAccept(expense.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDecline(expense.id)}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 