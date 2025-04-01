"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/actions/settings";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update Clerk profile
      await user?.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      });

      // Update Prisma database
      const result = await updateUserProfile({ 
        name,
        email: user?.emailAddresses[0]?.emailAddress,
        imageUrl: user?.imageUrl,
      });

      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
            <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium">{user?.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
          <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="max-w-[240px]"
          />
          <p className="text-sm text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditing(false);
            setName(user?.fullName || "");
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 