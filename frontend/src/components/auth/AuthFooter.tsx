import Link from "next/link";

interface AuthFooterProps {
    text: string;
    linkText: string;
    href: string;
}

export function AuthFooter({
    text,
    linkText,
    href
}: AuthFooterProps) {
    return (
        <p className="text-center text-sm text-muted-foreground">
            {text} {" "}
            <Link
                href={href}
                replace
                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
                {linkText}
            </Link>
        </p>
    )
}