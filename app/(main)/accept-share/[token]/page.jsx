import { getSharedExpenseByLink } from "@/actions/shared-expense";
import { notFound } from "next/navigation";
import { AcceptShareForm } from "./_components/accept-share-form";

export default async function AcceptSharePage({ params }) {
  const { sharedExpense } = await getSharedExpenseByLink(params.token);

  if (!sharedExpense) {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-title">
            Accept Shared Expense
          </h1>
          <p className="text-muted-foreground">
            Review and accept the expense shared with you
          </p>
        </div>

        <AcceptShareForm sharedExpense={sharedExpense} />
      </div>
    </div>
  );
} 