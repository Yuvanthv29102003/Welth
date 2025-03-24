"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function generateApiKey(name, key) {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const apiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        name,
        key,
      },
    });

    return { success: true, key: apiKey };
  } catch (error) {
    console.error("Error generating API key:", error);
    return { success: false, error: "Failed to generate API key" };
  }
}

export async function deleteApiKey(keyId) {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    await db.apiKey.delete({
      where: {
        id: keyId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

export async function listApiKeys() {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const keys = await db.apiKey.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: keys };
  } catch (error) {
    console.error("Error listing API keys:", error);
    return { success: false, error: "Failed to list API keys" };
  }
}

export async function updateUserPreferences(preferences) {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const updatedPreferences = await db.userPreference.update({
      where: {
        userId: user.id,
      },
      data: preferences,
    });

    return { success: true, data: updatedPreferences };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

export async function getUserPreferences() {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const preferences = await db.userPreference.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!preferences) {
      // Create default preferences if they don't exist
      const defaultPreferences = await db.userPreference.create({
        data: {
          userId: user.id,
          currency: "INR",
          language: "en",
          theme: "system",
          compactMode: false,
          emailNotifications: true,
          budgetAlerts: true,
          recurringAlerts: true,
        },
      });
      return { success: true, data: defaultPreferences };
    }

    return { success: true, data: preferences };
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return { success: false, error: "Failed to fetch preferences" };
  }
} 