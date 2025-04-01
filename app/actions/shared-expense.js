// "use server";

// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";
// import { nanoid } from "nanoid";
// import { addDays } from "date-fns";

// // This file will be used in version 2
// // Shared expense functionality is coming soon!

// export async function createSharedExpense(transactionId, data) {
//   const { userId: clerkUserId } = auth();
  
//   if (!clerkUserId) {
//     return { 
//       success: false, 
//       error: "Authentication required. Please sign in to share expenses." 
//     };
//   }

//   try {
//     console.log("Starting createSharedExpense with transactionId:", transactionId);
//     console.log("Clerk auth userId:", clerkUserId);

//     // Get the database user ID from Clerk ID
//     const dbUser = await db.user.findUnique({
//       where: { clerkUserId },
//       select: {
//         id: true,
//         email: true,
//       },
//     });
//     console.log("Found database user:", dbUser);

//     if (!dbUser) {
//       console.error("User not found in database for clerk ID:", clerkUserId);
//       return { 
//         success: false, 
//         error: "User account not found. Please try signing out and signing in again." 
//       };
//     }

//     const { emails = [], amountPerPerson, message, generateLink } = data;
//     console.log("Processing share request with emails:", emails);

//     if (!Array.isArray(emails)) {
//       return { 
//         success: false, 
//         error: "Invalid email format. Please enter valid email addresses." 
//       };
//     }

//     // Get the transaction and verify ownership
//     const transaction = await db.transaction.findUnique({
//       where: { 
//         id: transactionId,
//         userId: dbUser.id,
//       },
//       include: {
//         user: true
//       }
//     });
//     console.log("Found transaction:", transaction ? "yes" : "no");

//     if (!transaction) {
//       console.error("Transaction not found or not owned by user:", transactionId);
//       return { 
//         success: false, 
//         error: "Transaction not found or you are not authorized to share it." 
//       };
//     }

//     // Create shared expenses for each email
//     const sharedExpensesPromises = emails.map(async (email) => {
//       try {
//         if (!email || typeof email !== 'string' || !email.includes('@')) {
//           return {
//             success: false,
//             error: `Invalid email address: ${email}`
//           };
//         }

//         console.log("Processing email:", email);
        
//         // Find or create user with this email
//         let sharedWithUser = await db.user.findUnique({
//           where: { email },
//           select: { id: true },
//         });
//         console.log("Found existing user for email:", sharedWithUser ? "yes" : "no");

//         if (!sharedWithUser) {
//           console.log("Creating new user for email:", email);
//           // Create a new user with their account and preferences
//           sharedWithUser = await db.$transaction(async (tx) => {
//             // Create the user
//             const newUser = await tx.user.create({
//               data: {
//                 email,
//                 clerkUserId: `temp_${nanoid()}`,
//                 name: email.split('@')[0], // Use part before @ as name
//                 // Create default account
//                 accounts: {
//                   create: {
//                     name: "Default Account",
//                     type: "CURRENT",
//                     balance: 0,
//                     isDefault: true,
//                   },
//                 },
//                 // Create default preferences
//                 preferences: {
//                   create: {
//                     currency: "INR",
//                     language: "en",
//                     theme: "system",
//                     compactMode: false,
//                     emailNotifications: true,
//                     budgetAlerts: true,
//                     recurringAlerts: true,
//                   },
//                 },
//               },
//               select: { id: true },
//             });
//             return newUser;
//           });
//         }

//         // Generate share link if requested
//         const shareLink = generateLink ? nanoid(10) : null;

//         const sharedExpense = await db.sharedExpense.create({
//           data: {
//             transactionId,
//             ownerId: dbUser.id,
//             sharedWithId: sharedWithUser.id,
//             shareLink,
//             amountPerPerson,
//             message,
//             expiresAt: generateLink ? addDays(new Date(), 7) : null,
//           },
//         });
//         console.log("Created shared expense:", sharedExpense.id);
        
//         return {
//           success: true,
//           sharedExpense
//         };
//       } catch (emailError) {
//         console.error("Error processing email:", email, emailError);
//         return { 
//           success: false, 
//           error: `Failed to share with ${email}: ${emailError.message}` 
//         };
//       }
//     });

//     const sharedExpenses = await Promise.all(sharedExpensesPromises);

//     // Check if any shares failed
//     const failedShares = sharedExpenses.filter(share => !share.success);
//     if (failedShares.length > 0) {
//       return {
//         success: false,
//         error: failedShares.map(share => share.error).join(", ")
//       };
//     }

//     console.log("Successfully created all shared expenses");
//     return { 
//       success: true, 
//       sharedExpenses: sharedExpenses.map(s => s.sharedExpense) 
//     };
//   } catch (error) {
//     console.error("Error creating shared expense:", error);
//     return { 
//       success: false, 
//       error: error.message || "An unexpected error occurred while sharing the expense. Please try again." 
//     };
//   }
// } 