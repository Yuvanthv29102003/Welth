import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex-1 space-y-1">
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={cn(
                "font-medium",
                transaction.amount < 0 ? "text-red-500" : "text-green-500"
              )}>
                {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              {transaction.category && (
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(transaction)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 