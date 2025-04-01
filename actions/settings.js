"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Update user profile
export async function updateUserProfile(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update user preferences
export async function updateUserPreferences(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Update or create user preferences
    const updatedPreferences = await db.userPreference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...data,
      },
      update: data,
    });

    revalidatePath("/settings");
    return { success: true, data: updatedPreferences };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete user account
export async function deleteUserAccount() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Delete all user data
    await db.$transaction([
      // Delete all user's transactions
      db.transaction.deleteMany({
        where: { userId: user.id },
      }),
      // Delete all user's accounts
      db.account.deleteMany({
        where: { userId: user.id },
      }),
      // Delete all user's budgets
      db.budget.deleteMany({
        where: { userId: user.id },
      }),
      // Delete user preferences
      db.userPreference.deleteMany({
        where: { userId: user.id },
      }),
      // Finally delete the user
      db.user.delete({
        where: { id: user.id },
      }),
    ]);

    // Note: You'll need to also sign out the user and delete their Clerk account
    // This will be handled on the client side

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Generate API key
export async function generateApiKey() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Generate a secure random API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Store the API key (you'll need to add this to your schema)
    const key = await db.apiKey.create({
      data: {
        userId: user.id,
        key: apiKey,
        name: `API Key ${new Date().toLocaleDateString()}`,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: { id: key.id, name: key.name } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete API key
export async function deleteApiKey(keyId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    await db.apiKey.delete({
      where: {
        id: keyId,
        userId: user.id,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// List API keys
export async function listApiKeys() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const keys = await db.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
      },
    });

    return { success: true, data: keys };
  } catch (error) {
    return { success: false, error: error.message };
  }
} 