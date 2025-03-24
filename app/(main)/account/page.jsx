import { Plus, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { getUserAccounts } from "@/actions/dashboard";
import { formatCurrency } from "@/lib/utils";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";

export default async function AccountsPage() {
  const accounts = await getUserAccounts();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Accounts
        </h1>
        <p className="text-gray-500 mt-2">Manage and track all your financial accounts in one place</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Account Card */}
        <CreateAccountDrawer>
          <Card className="group cursor-pointer border-2 border-dashed hover:border-purple-200 transition-all duration-300 bg-gradient-to-b from-white to-gray-50/50 hover:from-purple-50/50 hover:to-white relative overflow-hidden min-h-[260px]">
            <CardContent className="flex flex-col items-center justify-center h-full p-8">
              <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-50 p-4 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                Add New Account
              </h3>
              <p className="text-sm text-gray-500 text-center mt-2 max-w-[200px]">
                Create a new account to track your finances
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/30 to-purple-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* Account Cards */}
        {accounts?.map((account) => (
          <Link
            key={account.id}
            href={`/account/${account.id}`}
            className="block group"
          >
            <div className="relative rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-100 transition-all duration-300">
              <div className="absolute top-6 right-6 z-10">
                <Switch 
                  checked={account.isDefault}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              
              {/* Account Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-xl bg-gradient-to-br from-purple-100 to-indigo-50 p-3 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-purple-700 transition-colors">
                    {account.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                  </p>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-6 relative">
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-indigo-700 transition-all duration-300">
                  {formatCurrency(account.balance)}
                </p>
              </div>

              {/* Transaction Types */}
              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 group-hover:bg-green-100/80 transition-colors">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Income</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 group-hover:bg-red-100/80 transition-colors">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Expense</span>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/20 to-purple-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 