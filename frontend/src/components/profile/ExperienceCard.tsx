import {
  BriefcaseBusiness,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Experience {

  company: string;

  role: string;

  duration: string;
}

interface ExperienceCardProps {

  experiences: Experience[];
}

export function ExperienceCard({
  experiences,
}: ExperienceCardProps) {

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

            <h3
              className="
                text-lg font-semibold
                tracking-tight
              "
            >
              Experience
            </h3>

            <p
              className="
                mt-1

                text-sm
                text-muted-foreground
              "
            >
              Your professional
              work history.
            </p>

          </div>

          <div className="space-y-5">

            {experiences.map(
              (experience) => (

                <div
                  key={
                    experience.company
                  }

                  className="
                    flex items-start
                    gap-4
                  "
                >

                  <div
                    className="
                      flex h-10 w-10
                      items-center
                      justify-center

                      rounded-xl

                      bg-primary/10

                      text-primary
                    "
                  >

                    <BriefcaseBusiness
                      className="h-4 w-4"
                    />

                  </div>

                  <div>

                    <h4
                      className="
                        font-semibold
                      "
                    >
                      {experience.role}
                    </h4>

                    <p
                      className="
                        text-sm
                        text-muted-foreground
                      "
                    >
                      {experience.company}
                    </p>

                    <p
                      className="
                        mt-1

                        text-xs
                        text-muted-foreground
                      "
                    >
                      {experience.duration}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </CardContent>

    </Card>
  );
}