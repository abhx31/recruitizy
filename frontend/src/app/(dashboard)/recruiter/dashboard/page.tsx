import {
  BriefcaseBusiness,
  Users,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";

const recentJobs = [
  {
    id: 1,

    title: "Frontend Engineer",

    applicants: 12,

    status: "Active",
  },

  {
    id: 2,

    title: "Backend Developer",

    applicants: 8,

    status: "Active",
  },

  {
    id: 3,

    title: "DevOps Engineer",

    applicants: 5,

    status: "Paused",
  },
];

const recentApplicants = [
  {
    id: 1,

    name: "Rahul Sharma",

    role: "Frontend Engineer",

    time: "2 hours ago",
  },

  {
    id: 2,

    name: "Priya Verma",

    role: "Backend Developer",

    time: "5 hours ago",
  },

  {
    id: 3,

    name: "Arjun Patel",

    role: "DevOps Engineer",

    time: "Yesterday",
  },
];

export default function RecruiterDashboardPage() {

  return (

    <div className="space-y-8 p-6 lg:p-8">

      {/* Header */}

      <DashboardHeader
        title="Recruiter Dashboard"

        description="
          Manage hiring activity,
          applicants, and job postings.
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
          title="Active Jobs"

          value="12"

          change="+2 this month"

          icon={BriefcaseBusiness}
        />

        <StatsCard
          title="Total Applicants"

          value="148"

          change="+18 this week"

          icon={Users}
        />

        <StatsCard
          title="Interviews"

          value="24"

          change="+6 scheduled"

          icon={CalendarDays}
        />

        <StatsCard
          title="Hires"

          value="7"

          change="+2 this month"

          icon={BadgeCheck}
        />

      </div>

      {/* Main Sections */}

      <div
        className="
          grid gap-6
          xl:grid-cols-2
        "
      >

        {/* Recent Jobs */}

        <section
          className="
            rounded-3xl

            border border-border/50

            bg-background/80

            p-6

            shadow-sm
          "
        >

          <div
            className="
              mb-6

              flex items-center
              justify-between
            "
          >

            <h2
              className="
                text-lg font-semibold
                tracking-tight
              "
            >
              Recent Jobs
            </h2>

          </div>

          <div className="space-y-4">

            {recentJobs.map((job) => (

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
                    {job.title}
                  </h3>

                  <p
                    className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                  >
                    {job.applicants} applicants
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
                  {job.status}
                </span>

              </div>

            ))}

          </div>

        </section>

        {/* Recent Applicants */}

        <section
          className="
            rounded-3xl

            border border-border/50

            bg-background/80

            p-6

            shadow-sm
          "
        >

          <div className="mb-6">

            <h2
              className="
                text-lg font-semibold
                tracking-tight
              "
            >
              Recent Applicants
            </h2>

          </div>

          <div className="space-y-4">

            {recentApplicants.map((applicant) => (

              <div
                key={applicant.id}

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
                    {applicant.name}
                  </h3>

                  <p
                    className="
                      mt-1 text-sm
                      text-muted-foreground
                    "
                  >
                    Applied for {applicant.role}
                  </p>

                </div>

                <span
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  {applicant.time}
                </span>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
}