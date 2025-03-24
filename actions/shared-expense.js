"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { addDays } from "date-fns";

export async function createSharedExpense(transactionId, data) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { emails, amountPerPerson, message, generateLink } = data;

    // Get the transaction
    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.userId !== userId) throw new Error("Unauthorized");

    // Create shared expenses for each email
    const sharedExpenses = await Promise.all(
      emails.map(async (email) => {
        // Find or create user with this email
        let sharedWithUser = await db.user.findUnique({
          where: { email },
        });

        if (!sharedWithUser) {
          // Create a new user with this email
          sharedWithUser = await db.user.create({
            data: {
              email,
              clerkUserId: `temp_${nanoid()}`,
            },
          });
        }

        // Generate share link if requested
        const shareLink = generateLink ? nanoid(10) : null;

        return db.sharedExpense.create({
          data: {
            transactionId,
            ownerId: userId,
            sharedWithId: sharedWithUser.id,
            shareLink,
            amountPerPerson,
            message,
            expiresAt: generateLink ? addDays(new Date(), 7) : null,
          },
        });
      })
    );

    return { success: true, sharedExpenses };
  } catch (error) {
    console.error("Error creating shared expense:", error);
    return { success: false, error: error.message };
  }
}

export async function acceptSharedExpense(shareId) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const sharedExpense = await db.sharedExpense.findUnique({
      where: { id: shareId },
      include: { transaction: true },
    });

    if (!sharedExpense) throw new Error("Shared expense not found");
    if (sharedExpense.status !== "PENDING") throw new Error("Invalid status");
    if (sharedExpense.expiresAt && new Date() > sharedExpense.expiresAt) {
      throw new Error("Share link has expired");
    }

    // Update status to accepted
    await db.sharedExpense.update({
      where: { id: shareId },
      data: { status: "ACCEPTED" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error accepting shared expense:", error);
    return { success: false, error: error.message };
  }
}

export async function declineSharedExpense(shareId) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const sharedExpense = await db.sharedExpense.findUnique({
      where: { id: shareId },
    });

    if (!sharedExpense) throw new Error("Shared expense not found");
    if (sharedExpense.status !== "PENDING") throw new Error("Invalid status");

    await db.sharedExpense.update({
      where: { id: shareId },
      data: { status: "DECLINED" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error declining shared expense:", error);
    return { success: false, error: error.message };
  }
}

export async function getSharedExpenses() {
  try {
    const { userId } = auth();
    if (!userId) {
      return [];
    }

    const sharedExpenses = await db.sharedExpense.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { sharedWithId: userId }
        ]
      },
      include: {
        transaction: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        sharedWith: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sharedExpenses;
  } catch (error) {
    console.error("Error fetching shared expenses:", error);
    return [];
  }
}

export async function getSharedExpenseByLink(shareLink) {
  try {
    const sharedExpense = await db.sharedExpense.findUnique({
      where: { shareLink },
      include: {
        transaction: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!sharedExpense) throw new Error("Shared expense not found");
    if (sharedExpense.status !== "PENDING") throw new Error("Invalid status");
    if (sharedExpense.expiresAt && new Date() > sharedExpense.expiresAt) {
      throw new Error("Share link has expired");
    }

    return { success: true, sharedExpense };
  } catch (error) {
    console.error("Error getting shared expense by link:", error);
    return { success: false, error: error.message };
  }
} 