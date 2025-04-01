"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedCard({
  title,
  description,
  icon,
  children,
  delay = 0,
  className = "",
}) {
  const IconComponent = Icons[icon];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
} 