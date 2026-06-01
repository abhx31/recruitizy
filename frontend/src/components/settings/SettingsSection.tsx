import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface SettingsSectionProps {

  title: string;

  description: string;

  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {

  return (

    <Card
      className="
        rounded-3xl

        border-border/50

        bg-background/80
      "
    >

      <CardContent className="p-6">

        <div className="space-y-6">

          <div>

            <h2
              className="
                text-lg font-semibold
                tracking-tight
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1

                text-sm
                text-muted-foreground
              "
            >
              {description}
            </p>

          </div>

          {children}

        </div>

      </CardContent>

    </Card>
  );
}