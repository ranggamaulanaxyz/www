import { cn } from "cn";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { useIsScrolled } from "~/hooks/use-is-scrolled";
import { useScrollDirection } from "~/hooks/use-scroll-direction";

export default function WebsiteNavbar() {
  const isVisible = useScrollDirection();
  const isScrolled = useIsScrolled(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full p-1 transition-transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div
        className={cn(
          "container mx-auto flex w-full items-center rounded-lg px-4 py-2 transition-colors",
          isScrolled ? "border bg-white/70 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <Link
          to="/"
          title="Rangga Maulana"
          className="flex h-12 items-center gap-2"
        >
          <img
            src="/logo42x42.png"
            className="h-10 rounded-full bg-slate-600 outline-2 outline-offset-1 outline-slate-700 transition-all duration-300 hover:bg-slate-500"
          />
          <span className="font-brand hidden text-3xl text-slate-500 transition-colors duration-300 hover:text-slate-700 sm:inline-block">
            Rangga
          </span>
        </Link>
        <nav className="ml-auto">
          <ul>
            <li>
              <Link
                to="/contact/me"
                title="Hubungi Saya"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "border-primary text-primary",
                )}
              >
                Hubungi Saya <ArrowRightIcon />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
