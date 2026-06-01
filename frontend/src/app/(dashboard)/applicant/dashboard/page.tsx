import {
  BriefcaseBusiness,
  CalendarDays,
  BadgeCheck,
  UserCircle,
} from "lucide-react";

import { DashboardHeader }
from "@/components/dashboard/DashboardHeader";

import { StatsCard }
from "@/components/dashboard/StatsCard";

const recentApplications = [
  {
    id: 1,

    role: "Frontend Engineer",

    company: "Vercel",

    status: "Under Review",
  },

  {
    id: 2,

    role: "Backend Developer",

    company: "Stripe",

    status: "Interview Scheduled",
  },

  {
    id: 3,

    role: "DevOps Engineer",

    company: "Netflix",

    status: "Rejected",
  },
];

const recommendedJobs = [
  {
    id: 1,

    role: "Full Stack Engineer",

    company: "Linear",
  },

  {
    id: 2,

    role: "Platform Engineer",

    company: "Notion",
  },

  {
    id: 3,

    role: "Frontend Developer",

    company: "Figma",
  },
];

export default function ApplicantDashboardPage() {

  return (

    <div className="space-y-8 p-6 lg:p-8">

      {/* Header */}

      <DashboardHeader
        title="Applicant Dashboard"

        description="
          Track applications and
          discover new opportunities.
        "
      />

      {/* Stats */}

      <div
        className="
          grid gap-6

          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatsCard
          title="Applications"

          value="18"

          change="+4 this month"

          icon={BriefcaseBusiness}
        />

        <StatsCard
          title="Interviews"

          value="5"

          change="+2 upcoming"

          icon={CalendarDays}
        />

        <StatsCard
          title="Offers"

          value="2"

          change="+1 this week"

          icon={BadgeCheck}
        />

        <StatsCard
          title="Profile Completion"

          value="85%"

          change="Looking strong"

          icon={UserCircle}
        />

      </div>

      {/* Main Sections */}

      <div
        className="
          grid gap-6
          xl:grid-cols-2
        "
      >

        {/* Recent Applications */}

        <section
          className="
            rounded-3xl

            border border-border/50

            bg-background/80

            p-6

            shadow-sm
          "
        >

          <h2
            className="
              mb-6

              text-lg font-semibold
              tracking-tight
            "
          >
            Recent Applications
          </h2>

          <div className="space-y-4">

            {recentApplications.map((application) => (

              <div
                key={application.id}

                className="
                  flex items-center
                  justify-between

                  rounded-2xl

                  border border-border/50

                  p-4

                  transition-colors

                  hover:bg-muted/30
                "
              >

                <div>

                  <h3 className="font-medium">
                    {application.role}
                  </h3>

                  <p
                    className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                  >
                    {application.company}
                  </p>

                </div>

                <span
                  className="
                    rounded-full

                    bg-primary/10

                    px-3 py-1

                    text-xs font-medium

                    text-primary
                  "
                >
                  {application.status}
                </span>

              </div>

            ))}

          </div>

        </section>

        {/* Recommended Jobs */}

        <section
          className="
            rounded-3xl

            border border-border/50

            bg-background/80

            p-6

            shadow-sm
          "
        >

          <h2
            className="
              mb-6

              text-lg font-semibold
              tracking-tight
            "
          >
            Recommended Jobs
          </h2>

          <div className="space-y-4">

            {recommendedJobs.map((job) => (

              <div
                key={job.id}

                className="
                  flex items-center
                  justify-between

                  rounded-2xl

                  border border-border/50

                  p-4

                  transition-colors

                  hover:bg-muted/30
                "
              >

                <div>

                  <h3 className="font-medium">
                    {job.role}
                  </h3>

                  <p
                    className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                  >
                    {job.company}
                  </p>

                </div>

                <button
                  className="
                    rounded-xl

                    bg-primary

                    px-4 py-2

                    text-sm font-medium

                    text-primary-foreground

                    transition-opacity

                    hover:opacity-90
                  "
                >
                  Apply
                </button>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}