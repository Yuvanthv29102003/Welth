"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserPreferences } from "@/actions/settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const defaultPreferences = {
  currency: "INR",
  language: "en",
  theme: "system",
  compactMode: false,
  emailNotifications: true,
  budgetAlerts: true,
  recurringAlerts: true,
};

export function PreferencesForm({ preferences = defaultPreferences }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(preferences);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateUserPreferences(formData);
      if (result.success) {
        toast.success("Preferences updated successfully");
      } else {
        toast.error(result.error || "Failed to update preferences");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleChange("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="GBP">British Pound (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => handleChange("theme", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact Mode</Label>
            <p className="text-sm text-muted-foreground">
              Use a more compact layout for better space utilization
            </p>
          </div>
          <Switch
            checked={formData.compactMode}
            onCheckedChange={(checked) => handleChange("compactMode", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </p>
          </div>
          <Switch
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Budget Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when you're close to your budget limits
            </p>
          </div>
          <Switch
            checked={formData.budgetAlerts}
            onCheckedChange={(checked) => handleChange("budgetAlerts", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Recurring Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Receive reminders for recurring transactions
            </p>
          </div>
          <Switch
            checked={formData.recurringAlerts}
            onCheckedChange={(checked) => handleChange("recurringAlerts", checked)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
} 