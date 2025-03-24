"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./_components/profile-form";
import { PreferencesForm } from "./_components/preferences-form";
import { DeleteAccount } from "./_components/delete-account";
import { AccountActivity } from "./_components/account-activity";
import { AnimatedCard } from "./_components/animated-card";
import { updateUserPreferences } from "@/actions/settings";
import { Download, Bell, Shield, User, Palette, Database } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [preferences, setPreferences] = useState({
    currency: "INR",
    language: "en",
    theme: "system",
    compactMode: false,
    emailNotifications: true,
    budgetAlerts: true,
    recurringAlerts: true,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      const result = await updateUserPreferences(preferences);
      if (result.success) {
        setPreferences(result.data);
      }
    };
    loadPreferences();
  }, []);

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <AnimatedCard
            title="Profile Information"
            description="Update your personal information and email preferences"
            icon="User"
          >
            <ProfileForm user={user} />
          </AnimatedCard>

          <AnimatedCard
            title="Account Activity"
            description="View your recent account activity and sessions"
            icon="History"
            delay={0.1}
          >
            <AccountActivity />
          </AnimatedCard>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <AnimatedCard
            title="Financial Preferences"
            description="Configure your default currency and notification settings"
            icon="Wallet"
          >
            <PreferencesForm preferences={preferences} />
          </AnimatedCard>

          <AnimatedCard
            title="Notification Preferences"
            description="Manage how and when you receive notifications"
            icon="Bell"
            delay={0.1}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Email Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your account via email
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Push Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications on your device
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard
            title="Data Management"
            description="Export your data or manage your storage"
            icon="Database"
            delay={0.2}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Export Data</label>
                  <p className="text-sm text-muted-foreground">
                    Download all your account data in JSON format
                  </p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Storage Usage</label>
                  <p className="text-sm text-muted-foreground">
                    View and manage your storage space
                  </p>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </div>
          </AnimatedCard>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <AnimatedCard
            title="Theme & Display"
            description="Customize the look and feel of your dashboard"
            icon="Palette"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </AnimatedCard>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <AnimatedCard
            title="Security Settings"
            description="Manage your account security and privacy"
            icon="Shield"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-base font-medium">Delete Account</label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <DeleteAccount />
              </div>
            </div>
          </AnimatedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
} 