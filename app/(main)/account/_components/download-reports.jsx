"use client";

import { Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCSV, downloadPDF } from "@/lib/report-utils";
import { toast } from "sonner";

export function DownloadReports({ transactions, accountName }) {
  const handleDownload = async (format) => {
    try {
      if (format === "csv") {
        await downloadCSV(transactions || [], accountName);
        toast.success(
          transactions?.length > 0
            ? "CSV report downloaded successfully"
            : "Empty CSV report downloaded successfully"
        );
      } else if (format === "pdf") {
        await downloadPDF(transactions || [], accountName);
        toast.success(
          transactions?.length > 0
            ? "PDF report downloaded successfully"
            : "Empty PDF report downloaded successfully"
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          title="Download Reports"
        >
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload("csv")}>
          <FileDown className="mr-2 h-4 w-4" />
          Download CSV
          {transactions?.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({transactions.length} transactions)
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload("pdf")}>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
          {transactions?.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({transactions.length} transactions)
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 