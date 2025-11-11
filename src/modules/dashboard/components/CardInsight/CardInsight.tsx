import { Card, CardContent, CardHeader } from "@/core/components/ui/card";

export interface CardInsightProps {
  title: string;
  description?: string;
  value: string | number;
  valueDescription?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function CardInsight({
  title,
  description,
  value,
  valueDescription,
  trend,
  icon,
}: CardInsightProps) {
  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-2">
          {/* Icon and Title Row */}
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="text-base font-medium leading-5 text-foreground">
              {title}
            </h3>
          </div>
          {/* Description */}
          {description && (
            <p className="text-base text-muted-foreground leading-6">
              {description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        {/* Large Value */}
        <div className="text-[36px] font-normal leading-[40px] text-foreground">
          {value}
        </div>
        {/* Value Description */}
        {valueDescription && (
          <p className="text-base text-muted-foreground leading-6">
            {valueDescription}
          </p>
        )}
        {/* Trend (optional, for backward compatibility) */}
        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
