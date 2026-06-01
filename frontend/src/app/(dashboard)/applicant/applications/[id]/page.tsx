import {
    BriefcaseBusiness,
    CalendarDays,
    FileText,
    Sparkles,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const applications = [
    {
        id: "1",

        title: "Frontend Engineer",

        company: "Vercel",

        appliedAt: "May 12, 2026",

        status: "Reviewing",

        resume: "frontend_resume.pdf",

        aiScore: "86%",

        strengths: [
            "Strong React experience",
            "Good TypeScript knowledge",
            "Modern frontend stack",
        ],

        missingSkills: [
            "GraphQL",
            "Testing",
        ],
    },
];

export default async function
    ApplicationDetailsPage({
        params,
    }: {
        params: Promise<{ id: string }>
    }) {

    const { id } = await params;

    const application =
        applications.find(
            (application) =>
                application.id === id
        );

    if (!application) {

        return (
            <div>
                Application not found
            </div>
        );
    }

    return (

        <div
            className="
        mx-auto

        max-w-5xl

        space-y-8

        p-6 lg:p-8
      "
        >

            {/* Header */}

            <Card
                className="
          rounded-3xl

          border-border/50

          bg-background/80
        "
            >

                <CardContent className="p-8">

                    <div className="space-y-5">

                        <div
                            className="
                flex items-center
                gap-3
              "
                        >

                            <h1
                                className="
                  text-3xl font-bold
                  tracking-tight
                "
                            >
                                {application.title}
                            </h1>

                            <span
                                className="
                  rounded-full

                  bg-primary/10

                  px-3 py-1

                  text-sm font-medium

                  text-primary
                "
                            >
                                {application.status}
                            </span>

                        </div>

                        <div
                            className="
                flex items-center gap-2

                text-muted-foreground
              "
                        >

                            <BriefcaseBusiness
                                className="h-4 w-4"
                            />

                            <span>
                                {application.company}
                            </span>

                        </div>

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
                                Applied on
                                {" "}
                                {application.appliedAt}
                            </span>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* Resume */}

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
              flex items-center gap-3
            "
                    >

                        <FileText
                            className="
                h-5 w-5 text-primary
              "
                        />

                        <div>

                            <h2
                                className="
                  font-semibold
                "
                            >
                                Resume Used
                            </h2>

                            <p
                                className="
                  text-sm
                  text-muted-foreground
                "
                            >
                                {application.resume}
                            </p>

                        </div>

                    </div>

                </CardContent>

            </Card>

            {/* AI Analysis */}

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
              flex items-center gap-3
            "
                    >

                        <Sparkles
                            className="
                h-5 w-5 text-primary
              "
                        />

                        <h2
                            className="
                text-2xl font-semibold
                tracking-tight
              "
                        >
                            AI Resume Analysis
                        </h2>

                    </div>

                    <div className="mt-6">

                        <div
                            className="
        w-full

        rounded-3xl

        bg-primary/10

        p-8
    "
                        >

                            <p
                                className="
            text-sm
            text-muted-foreground
        "
                            >
                                ATS Match Score
                            </p>

                            <h3
                                className="
            mt-3

            text-6xl font-bold

            tracking-tight

            text-primary
        "
                            >
                                {application.aiScore}
                            </h3>

                        </div>

                    </div>

                    {/* Strengths */}

                    <div className="mt-12">

                        <h3
                            className="
            text-sm font-semibold

            text-foreground
        "
                        >
                            Strengths
                        </h3>

                        <div
                            className="
            mt-6

            flex flex-wrap
            gap-3
        "
                        >

                            {application.strengths.map(
                                (strength) => (

                                    <span
                                        key={strength}

                                        className="
                        rounded-full

                        bg-primary/10

                        px-4 py-2

                        text-sm

                        text-primary
                    "
                                    >

                                        {strength}

                                    </span>

                                )
                            )}

                        </div>

                    </div>
                    {/* Missing Skills */}

                    <div className="mt-12">

                        <h3
                            className="
            text-sm font-semibold

            text-foreground
        "
                        >
                            Missing Skills
                        </h3>

                        <div
                            className="
            mt-6

            flex flex-wrap
            gap-3
        "
                        >

                            {application.missingSkills.map(
                                (missingSkill) => (

                                    <span
                                        key={missingSkill}

                                        className="
                        rounded-full

                        bg-primary/10

                        px-4 py-2

                        text-sm

                        text-primary
                    "
                                    >

                                        {missingSkill}

                                    </span>

                                )
                            )}

                        </div>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
}