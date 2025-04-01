import { format } from "date-fns";
import { formatCurrency } from "./utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function generateCSV(transactions, accountName) {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  
  // Always include headers even if there are no transactions
  const csvContent = [
    headers.join(","),
    // If there are transactions, add them as rows
    ...(transactions?.length > 0
      ? transactions.map((t) => [
          format(new Date(t.date), "yyyy-MM-dd"),
          t.description || "Untitled Transaction",
          t.category,
          t.type,
          formatCurrency(t.amount),
        ]).map((row) => row.join(","))
      : []),
  ].join("\n");

  return csvContent;
}

export function downloadCSV(transactions, accountName) {
  try {
    const csvContent = generateCSV(transactions || [], accountName);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${accountName}_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
}

export function generatePDF(transactions, accountName) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`${accountName} - Transaction Report`, 14, 15);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), "yyyy-MM-dd")}`, 14, 25);
  
  // Add summary
  if (transactions?.length > 0) {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 35);
    doc.text(`Total Expense: ${formatCurrency(totalExpense)}`, 14, 42);
    doc.text(`Net Balance: ${formatCurrency(totalIncome - totalExpense)}`, 14, 49);
  } else {
    doc.text("No transactions found", 14, 35);
  }

  // Add table
  if (transactions?.length > 0) {
    const tableData = transactions.map(t => [
      format(new Date(t.date), "yyyy-MM-dd"),
      t.description || "Untitled Transaction",
      t.category,
      t.type,
      formatCurrency(t.amount)
    ]);

    doc.autoTable({
      startY: 60,
      head: [["Date", "Description", "Category", "Type", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 60 }, // Description
        2: { cellWidth: 30 }, // Category
        3: { cellWidth: 25 }, // Type
        4: { cellWidth: 30 }, // Amount
      },
    });
  }

  return doc;
}

export function downloadPDF(transactions, accountName) {
  try {
    const doc = generatePDF(transactions || [], accountName);
    doc.save(`${accountName}_transactions_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
} 