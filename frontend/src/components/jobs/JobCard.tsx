import Link from "next/link";

import {
    BriefcaseBusiness,
    Clock3,
    MapPin,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface JobCardProps {

    id: string;

    title: string;

    company: string;

    location?: string;

    experience: string;

    type: string;

    description: string;

    status?: "OPEN" | "CLOSED" | "DRAFT";
}

export function JobCard({
    id,
    title,
    company,
    location,
    experience,
    type,
    description,
    status,
}: JobCardProps) {

    return (

        <Link href={`/applicant/jobs/${id}`}>

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

                    {/* Top Section */}

                    <div
                        className="
              flex items-start
              justify-between
              gap-4
            "
                    >

                        <div className="space-y-2">

                            <h2
                                className="
                  text-xl font-semibold
                  tracking-tight
                "
                            >
                                {title}
                            </h2>

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

                        </div>

                        {/* Employment Type */}

                        <span
                            className="
                rounded-full

                bg-primary/10

                px-3 py-1

                text-xs font-medium

                text-primary
              "
                        >
                            {type}
                        </span>

                    </div>

                    {/* Description */}

                    <p
                        className="
              mt-5

              line-clamp-2

              text-sm leading-relaxed

              text-muted-foreground
            "
                    >
                        {description}
                    </p>

                    {/* Meta */}

                    <div
                        className="
              mt-6

              flex flex-wrap
              items-center

              gap-4

              text-sm
              text-muted-foreground
            "
                    >

                        {location && (
                            <div
                                className="
                flex items-center gap-2
              "
                            >

                                <MapPin className="h-4 w-4" />

                                <span>
                                    {location}
                                </span>

                            </div>
                        )}

                        <div
                            className="
                flex items-center gap-2
              "
                        >

                            <Clock3 className="h-4 w-4" />

                            <span>
                                {experience}
                            </span>

                        </div>

                    </div>

                    {/* Status */}

                    {status && (

                        <div className="mt-6">

                            <span
                                className={`
                  rounded-full

                  px-3 py-1

                  text-xs font-medium

                  ${status === "OPEN"
                                        ? "bg-emerald-500/10 text-emerald-500"

                                        : status === "DRAFT"
                                            ? "bg-yellow-500/10 text-yellow-500"

                                            : "bg-red-500/10 text-red-500"
                                    }
                `}
                            >

                                {status.replace("_", " ")}

                            </span>

                        </div>

                    )}

                </CardContent>

            </Card>

        </Link>
    );
}