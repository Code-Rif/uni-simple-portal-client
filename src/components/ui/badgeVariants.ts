import { cva } from "class-variance-authority";

export const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                success:
                    "border-transparent bg-success-light text-success-dark",
                warning:
                    "border-transparent bg-warning-light text-warning-dark",
                error:
                    "border-transparent bg-error-light text-error-dark",
                info:
                    "border-transparent bg-info-light text-info-dark",
                outline: "text-foreground border-border",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
