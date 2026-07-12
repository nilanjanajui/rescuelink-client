type BadgeVariant = "critical" | "moderate" | "low" | "active" | "resolved";

const variantStyles: Record<BadgeVariant, string> = {
    critical: "bg-red-100 text-red-700",
    moderate: "bg-amber-100 text-amber-700",
    low: "bg-teal-100 text-teal-700",
    active: "bg-emerald-100 text-emerald-700",
    resolved: "bg-neutral-200 text-neutral-600",
};

export default function Badge({
    variant,
    children,
}: {
    variant: BadgeVariant;
    children: React.ReactNode;
}) {
    return (
        <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]}`}
        >
            {children}
        </span>
    );
}