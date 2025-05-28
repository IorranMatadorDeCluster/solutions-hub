"use client"

import * as React from "react"

export const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
Chart.displayName = "Chart"

export const ChartHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartHeader.displayName = "ChartHeader"

export const ChartTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartTitle.displayName = "ChartTitle"

export const ChartBars = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartBars.displayName = "ChartBars"

export const ChartBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartBar.displayName = "ChartBar"

export const ChartXAxis = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartXAxis.displayName = "ChartXAxis"

export const ChartYAxis = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartYAxis.displayName = "ChartYAxis"

export const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartTooltip.displayName = "ChartTooltip"
