"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Share2,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-indigo-500",
  },
  {
    label: "Accounts",
    icon: Wallet,
    href: "/account",
    color: "text-purple-500",
  },
  {
    label: "Shared Expenses",
    icon: Share2,
    href: "/shared-expenses",
    color: "text-pink-500",
    badge: "Coming Soon",
    badgeColor: "bg-blue-100 text-blue-800",
    disabled: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export function Nav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        )}

        {/* Mobile Navigation Menu */}
        <div className={cn(
          "fixed inset-y-0 bg-background border-l shadow-lg px-6 py-6 overflow-y-auto",
          "transition-all duration-300 ease-in-out",
          isMobileMenuOpen 
            ? "right-0 w-[280px] z-50"
            : "-right-[280px]"
        )}>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-4 py-3 text-base transition-all",
                  (pathname === route.href || pathname.startsWith(route.href + "/"))
                    ? "bg-gradient-to-r from-indigo-100 to-pink-100 font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <route.icon className={cn("h-6 w-6", route.color)} />
                  {route.label}
                </div>
                {(pathname === route.href || pathname.startsWith(route.href + "/")) && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden lg:block">
        <div className="space-y-1 pt-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-4 py-3 text-base transition-all",
                (pathname === route.href || pathname.startsWith(route.href + "/"))
                  ? "bg-gradient-to-r from-indigo-100 to-pink-100 font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-4">
                <route.icon className={cn("h-6 w-6", route.color)} />
                {route.label}
              </div>
              {(pathname === route.href || pathname.startsWith(route.href + "/")) && (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
} 