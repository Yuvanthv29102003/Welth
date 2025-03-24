import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SharedExpensesPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-8 w-8 text-pink-500" />
            <CardTitle className="text-2xl">Shared Expenses</CardTitle>
          </div>
          <CardDescription>
            Coming Soon - Version 2.0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Split Expenses with Ease</h3>
            <p className="text-muted-foreground">
              We're working on bringing you a powerful expense sharing feature that will make splitting bills and tracking shared expenses effortless.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950/20">
              <h4 className="font-semibold mb-2">What's Coming</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Split expenses with friends and family</li>
                <li>• Track who owes what</li>
                <li>• Generate shareable expense links</li>
                <li>• Email notifications for shared expenses</li>
                <li>• Settlement tracking</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-semibold mb-2">Stay Tuned</h4>
              <p className="text-sm text-muted-foreground">
                We're working hard to bring you this feature. Sign up for our newsletter to be notified when it launches!
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Notify Me
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 