"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { History, Monitor, Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export function AccountActivity() {
  const [activity, setActivity] = useState({
    lastLogin: new Date(),
    device: navigator.userAgent,
    location: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get approximate location using IP (you can use a service like ipapi.co)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setActivity((prev) => ({
          ...prev,
          location: `${data.city}, ${data.country_name}`,
        }));
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback if location fetch fails
        setActivity((prev) => ({
          ...prev,
          location: "Location not available",
        }));
        setIsLoading(false);
      });
  }, []);

  const activityCards = [
    {
      icon: History,
      title: "Last Login",
      value: activity.lastLogin.toLocaleString(),
    },
    {
      icon: Monitor,
      title: "Device",
      value: activity.device,
      truncate: true,
    },
    {
      icon: Globe,
      title: "Location",
      value: activity.location || "Loading...",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">Recent Activity</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {activityCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="p-4 flex items-start space-x-4 h-full">
              <card.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{card.title}</p>
                <p
                  className={`text-sm text-muted-foreground ${
                    card.truncate ? "truncate max-w-[200px]" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 