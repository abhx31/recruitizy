import { BriefcaseBusiness, Search } from "lucide-react";

interface RoleSelectorProps {
  value: "applicant" | "recruiter";

  onChange: (
    value: "applicant" | "recruiter"
  ) => void;
}

const roles = [
  {
    value: "recruiter",
    title: "Hiring Team",
    description:
      "Post jobs, manage candidates, and streamline hiring.",

    icon: BriefcaseBusiness,
  },

  {
    value: "applicant",
    title: "Job Seeker",
    description:
      "Discover opportunities and track applications.",

    icon: Search,
  },
] as const;

export function RoleSelector({
  value,
  onChange,
}: RoleSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">

      {roles.map((role) => {

        const isSelected =
          value === role.value;

        const Icon = role.icon;

        return (
          <button
            key={role.value}
            type="button"

            onClick={() =>
              onChange(role.value)
            }

            className={`
              group relative overflow-hidden rounded-3xl border p-5 text-left
              transition-all duration-300

              hover:-translate-y-1
              hover:border-primary/40
              hover:bg-primary/[0.03]

              ${
                isSelected
                  ? `
                    border-primary/50
                    bg-primary/[0.08]
                    shadow-[0_0_30px_rgba(34,197,94,0.12)]
                    ring-1 ring-primary/20
                  `
                  : `
                    border-border/80
                    bg-card
                  `
              }
            `}
          >

            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            )}

            <div className="relative z-10 space-y-5">

              <div
                className={`
                  flex h-11 w-11 items-center justify-center rounded-2xl
                  transition-colors

                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="space-y-2">

                <h3 className="text-base font-semibold tracking-tight">
                  {role.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {role.description}
                </p>

              </div>

            </div>

          </button>
        );
      })}
    </div>
  );
}