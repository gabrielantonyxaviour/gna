"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function Aurora({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return enabled ? (
    <AuroraBackground>
      <motion.div
        // initial={{ opacity: 0.0, y: 40 }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{
        //   delay: 0.3,
        //   duration: 0.8,
        //   ease: "easeInOut",
        // }}
        className="bg-secondary rounded-lg transition-bg p-3"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 blur-xl rounded-lg -z-10 animate-pulse rounded-lg"></div>

        <div className="relative z-10 rounded-lg">{children}</div>
      </motion.div>
    </AuroraBackground>
  ) : (
    <>{children}</>
  );
}
