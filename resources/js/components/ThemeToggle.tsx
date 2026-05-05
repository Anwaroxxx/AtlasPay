import { useAppearance } from "@/hooks/use-appearance";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { appearance, updateAppearance } = useAppearance();

  const toggle = () => {
    updateAppearance(appearance === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {appearance === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
