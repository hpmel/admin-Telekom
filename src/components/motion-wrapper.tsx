"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export function MotionFadeIn({ children, delay = 0, className, ...props }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerGroup({ children, className, ...props }: MotionWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children, className, ...props }: MotionWrapperProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
