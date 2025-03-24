"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AccountCard({ account }) {
  const { id, name, balance, type, isDefault } = account;
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteAccountFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteAccountFn(id);
      if (result?.success) {
        toast.success("Account deleted successfully");
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Account deleted successfully");
      router.refresh();
    }
  }, [deleteResult, router]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete account");
    }
  }, [deleteError]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the switch or delete button
    if (
      e.target.closest('button') || 
      e.target.closest('[role="switch"]') ||
      e.target.closest('[role="dialog"]')
    ) {
      return;
    }
    router.push(`/account/${id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 cursor-pointer" 
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
          className="data-[state=checked]:bg-gradient-to-r from-indigo-600 to-purple-600"
        />
        {!isDefault && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this account? This action cannot be undone and will delete all transactions associated with this account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting || deleteLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
              <CreditCard className="h-4 w-4 text-indigo-600" />
            </div>
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="p-1.5 rounded-full bg-green-500/10 mr-2">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            </div>
            Income
          </div>
          <div className="flex items-center">
            <div className="p-1.5 rounded-full bg-red-500/10 mr-2">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            </div>
            Expense
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
