import { cn } from "cn";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { ArrowRightIcon, BriefcaseBusinessIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useIsScrolled } from "~/hooks/use-is-scrolled";
import { useScrollDirection } from "~/hooks/use-scroll-direction";

export function meta() {
  return [{ title: "Rangga Maulana" }];
}
export default function Home() {
  const isNavbarVisible = useScrollDirection();
  const isScrolled = useIsScrolled(200);
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40">
        <div
          className={cn(
            "container mx-auto flex w-full items-center px-4 py-2 transition-all",
            isScrolled ? "bg-white" : "bg-transparent",
            isNavbarVisible ? "translate-y-0" : "-translate-y-full",
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
                    buttonVariants({ variant: "outline", size: "xl" }),
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
      <main className="flex flex-1">
        <section className="flex-1 overflow-visible py-8">
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 md:flex-row md:justify-between md:gap-8">
            <div className="text-center sm:max-w-2xl md:text-left lg:max-w-4xl">
              <h1 className="font-display text-3xl leading-tight md:mb-4 md:text-4xl lg:text-5xl">
                Mengubah Alur Kerja Kompleks Menjadi Solusi Digital yang
                Intuitif
              </h1>
              <p className="mb-6 font-light">
                Saya merancang dan membangun sistem perangkat lunak kustom yang
                menyederhanakan proses rumit, mengotomatisasi efisiensi bisnis,
                dan menghadirkan pengalaman pengguna tanpa hambatan.
              </p>
              <div className="space-y-2 text-left">
                <div className="mb-2 flex items-center justify-center gap-2 md:mb-4 md:justify-start">
                  <InputGroup className="h-12 max-w-lg">
                    <InputGroupInput
                      placeholder="Masukan email kamu"
                      type="email"
                      required
                    />
                    <InputGroupAddon align="inline-end" className="p-0">
                      <InputGroupButton className="h-12 px-4" variant="default">
                        Demo Gratis <ArrowRightIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <Link
                  to="/projects"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                  </span>
                  Lihat semua proyek saya
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
            <div className="order-first md:order-last md:max-w-2xl">
              <div className="relative">
                <div className="overflow-hidden rounded-full bg-slate-100">
                  <img src="/logo500x500.png" className="relative z-30" />
                </div>
                <div className="absolute top-0 z-10 aspect-square w-1/2 rounded-full bg-slate-200">
                  <div className="absolute right-0 bottom-full aspect-square w-1/2 rounded-full bg-slate-300"></div>
                </div>
                <div className="absolute right-0 bottom-5 z-40 w-1/2 md:top-1/2 md:-left-1/4">
                  <div className="bg-primary text-primary-foreground relative rounded-2xl px-4 py-3 text-sm shadow-lg">
                    Saya Rangga, software engineer dengan 6 tahun pengalaman.
                    <div className="bg-primary absolute -top-1 size-3 rotate-40 md:top-auto md:-right-1 md:bottom-3 md:rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
