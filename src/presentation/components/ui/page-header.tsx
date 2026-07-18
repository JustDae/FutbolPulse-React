import * as React from "react"
import { cn } from "@/presentation/utils/cn"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground font-normal">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-4">
          {children}
        </div>
      )}
    </div>
  )
}
