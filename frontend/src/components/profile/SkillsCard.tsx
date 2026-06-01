import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface SkillsCardProps {

  skills: string[];
}

export function SkillsCard({
  skills,
}: SkillsCardProps) {

  return (

    <Card
      className="
        rounded-3xl

        border-border/50

        bg-background/80
      "
    >

      <CardContent className="p-6">

        <div className="space-y-5">

          <div>

            <h3
              className="
                text-lg font-semibold
                tracking-tight
              "
            >
              Skills
            </h3>

            <p
              className="
                mt-1

                text-sm
                text-muted-foreground
              "
            >
              Technologies and tools
              you work with.
            </p>

          </div>

          <div
            className="
              flex flex-wrap
              gap-3
            "
          >

            {skills.map(
              (skill) => (

                <span
                  key={skill}

                  className="
                    rounded-full

                    bg-primary/10

                    px-4 py-2

                    text-sm

                    text-primary
                  "
                >

                  {skill}

                </span>

              )
            )}

          </div>

        </div>

      </CardContent>

    </Card>
  );
}