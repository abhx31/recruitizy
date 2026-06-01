interface ProfileInformationProps {

  name: string;

  email: string;

  role: string;
}

export function ProfileInformation({
  name,
  email,
  role,
}: ProfileInformationProps) {

  const information = [
    {
      label: "Full Name",
      value: name,
    },

    {
      label: "Email Address",
      value: email,
    },

    {
      label: "Role",
      value:
        role.charAt(0)
          .toUpperCase() +
        role.slice(1),
    },

    {
      label: "Account Status",
      value: "Active",
    },
  ];

  return (

    <div
      className="
        rounded-3xl

        border border-border/50

        bg-background/80

        p-6
      "
    >

      <div className="space-y-6">

        <div>

          <h3
            className="
              text-lg font-semibold
              tracking-tight
            "
          >
            Information
          </h3>

          <p
            className="
              mt-1

              text-sm
              text-muted-foreground
            "
          >
            Basic account details.
          </p>

        </div>

        <div
          className="
            grid gap-6

            md:grid-cols-2
          "
        >

          {information.map((item) => (

            <div
              key={item.label}

              className="space-y-2"
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                {item.label}
              </p>

              <h4
                className="
                  text-base font-semibold
                "
              >
                {item.value}
              </h4>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}