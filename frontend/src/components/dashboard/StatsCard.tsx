import { ArrowUpRight }
    from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface StatsCardProps {

    title: string;

    value: string;

    change?: string;

    icon: React.ElementType;
}

export function StatsCard({
    title,
    value,
    change,
    icon: Icon,
}: StatsCardProps) {

    return (

        <Card
            className="
        rounded-3xl

        border-border/50

        bg-background/80

        shadow-sm

        transition-all duration-300

        hover:border-primary/20
        hover:shadow-lg
      "
        >

            <CardContent className="p-6">

                <div
                    className="
            flex items-start
            justify-between
          "
                >

                    <div className="space-y-2">

                        <p
                            className="
                text-sm font-medium
                text-muted-foreground
              "
                        >
                            {title}
                        </p>

                        <h3
                            className="
                text-3xl font-bold
                tracking-tight
              "
                        >
                            {value}
                        </h3>

                        {change && (

                            <div
                                className="
                  flex items-center gap-1

                  text-sm
                  text-emerald-500
                "
                            >

                                <ArrowUpRight
                                    className="h-4 w-4"
                                />

                                <span>
                                    {change}
                                </span>

                            </div>

                        )}

                    </div>

                    {/* Icon */}

                    <div
                        className="
              flex h-12 w-12
              items-center
              justify-center

              rounded-2xl

              bg-primary/10

              text-primary
            "
                    >

                        <Icon className="h-5 w-5" />

                    </div>

                </div>

            </CardContent>

        </Card>
    );
}