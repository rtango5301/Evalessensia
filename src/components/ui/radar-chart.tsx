'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface RadarChartProps {
  labels: string[];
  baselineData?: number[];
  currentData: number[];
  size?: number;
  showBaseline?: boolean;
  className?: string;
  baselineColor?: string;
  currentColor?: string;
}

function RadarChart({
  labels,
  baselineData,
  currentData,
  size = 200,
  showBaseline = true,
  className,
  baselineColor = 'var(--text-muted)',
  currentColor = 'var(--primary)',
}: RadarChartProps) {
  const center = size / 2;
  const levels = [60, 70, 80, 90, 100];
  const numSides = labels.length;
  const angleStep = (Math.PI * 2) / numSides;
  const maxRadius = size * 0.35;

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const createPath = (data: number[]) => {
    return (
      data
        .map((value, index) => {
          const point = getPoint(value, index);
          return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        })
        .join(' ') + ' Z'
    );
  };

  return (
    <svg width={size} height={size} className={cn('overflow-visible', className)}>
      {/* Grid levels */}
      {levels.map((level) => {
        const radius = (level / 100) * maxRadius;
        const points = Array.from({ length: numSides }, (_, j) => {
          const angle = angleStep * j - Math.PI / 2;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.5}
          />
        );
      })}

      {/* Axis lines */}
      {Array.from({ length: numSides }, (_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.5}
          />
        );
      })}

      {/* Baseline polygon */}
      {showBaseline && baselineData && (
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          d={createPath(baselineData)}
          fill={baselineColor}
          fillOpacity="0.1"
          stroke={baselineColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      )}

      {/* Current run polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ transformOrigin: `${center}px ${center}px` }}
        d={createPath(currentData)}
        fill={currentColor}
        fillOpacity="0.15"
        stroke={currentColor}
        strokeWidth="2"
      />

      {/* Data points */}
      {currentData.map((value, index) => {
        const point = getPoint(value, index);
        return (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={currentColor}
          />
        );
      })}

      {/* Labels */}
      {labels.map((label, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = maxRadius + 24;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-[var(--text-muted)]"
          >
            {label}
          </text>
        );
      })}

      {/* Center level labels */}
      {[80, 100].map((level) => (
        <text
          key={level}
          x={center + 4}
          y={center - (level / 100) * maxRadius}
          className="text-[10px] fill-[var(--text-muted)]"
        >
          {level}
        </text>
      ))}
    </svg>
  );
}

export { RadarChart };
