import Link from "next/link";

import {
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ApplicationCardProps {

  id: string;

  title: string;

  company: string;

  appliedAt: string;

  status:
    | "PENDING"
    | "REVIEWING"
    | "SHORTLISTED"
    | "REJECTED"
    | "ACCEPTED";
}

export function ApplicationCard({
  id,
  title,
  company,
  appliedAt,
  status,
}: ApplicationCardProps) {

  return (

    <Link
      href={`/applicant/applications/${id}`}
    >

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

          <div className="space-y-4">

            {/* Title + Status */}

            <div
              className="
                flex items-center
                gap-3
              "
            >

              <h2
                className="
                  text-xl font-semibold
                  tracking-tight
                "
              >
                {title}
              </h2>

              <span
                className={`
                  rounded-full

                  px-3 py-1

                  text-xs font-medium

                  ${
                    status === "REJECTED"
                      ? "bg-destructive/10 text-destructive"

                      : status === "PENDING"
                      ? "bg-muted text-muted-foreground"

                      : "bg-primary/10 text-primary"
                  }
                `}
              >

                {status.charAt(0) +
                  status
                    .slice(1)
                    .toLowerCase()}

              </span>

            </div>

            {/* Company */}

            <div
              className="
                flex items-center gap-2

                text-sm
                text-muted-foreground
              "
            >

              <BriefcaseBusiness
                className="h-4 w-4"
              />

              <span>
                {company}
              </span>

            </div>

            {/* Applied Date */}

            <div
              className="
                flex items-center gap-2

                text-sm
                text-muted-foreground
              "
            >

              <CalendarDays
                className="h-4 w-4"
              />

              <span>
                Applied on {appliedAt}
              </span>

            </div>

          </div>

        </CardContent>

      </Card>

    </Link>
  );
}