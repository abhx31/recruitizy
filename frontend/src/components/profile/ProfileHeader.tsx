import { ShieldCheck } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface ProfileHeaderProps {

    name: string;

    email: string;

    role: string;
}

export function ProfileHeader({
    name,
    email,
    role,
}: ProfileHeaderProps) {

    return (

        <Card
            className="
        rounded-3xl

        border-border/50

        bg-background/80
      "
        >

            <CardContent className="p-8">

                <div
                    className="
            flex flex-col gap-6

            lg:flex-row
            lg:items-center
          "
                >

                    {/* Avatar */}

                    <div
                        className="
    flex shrink-0

    h-24 w-24

    items-center
    justify-center

    rounded-full

    bg-primary

    text-3xl font-bold

    text-primary-foreground
  "
                    >

                        {name.charAt(0).toUpperCase()}

                    </div>

                    {/* User Info */}

                    <div className="space-y-3">

                        <div>

                            <h1
                                className="
                  text-3xl font-bold
                  tracking-tight
                "
                            >
                                {name}
                            </h1>

                            <p
                                className="
                  mt-1

                  text-muted-foreground
                "
                            >
                                {email}
                            </p>

                        </div>

                        <div
                            className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-primary/10

                px-4 py-2

                text-sm font-medium

                text-primary
              "
                        >

                            <ShieldCheck
                                className="h-4 w-4"
                            />

                            <span className="capitalize">
                                {
                                    role.charAt(0).toUpperCase() +
                                    role.slice(1)
                                }
                            </span>

                        </div>

                    </div>

                </div>

            </CardContent>

        </Card>
    );
}