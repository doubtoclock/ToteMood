import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement>

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
