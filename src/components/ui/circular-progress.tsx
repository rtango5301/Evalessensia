"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  showValue?: boolean
  className?: string
  valueClassName?: string
  labelClassName?: string
  trackColor?: string
  progressColor?: string
}

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  showValue = true,
  className,
  valueClassName,
  labelClassName,
  trackColor = "var(--border)",
  progressColor = "var(--primary)",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className={cn("text-2xl font-bold", valueClassName)}>
              {value.toFixed(1)}%
            </span>
          )}
          {label && (
            <span className={cn("text-xs text-[var(--text-muted)]", labelClassName)}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { CircularProgress }
