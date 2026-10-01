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

export function meta() {
  return [{ title: "Rangga Maulana" }];
}
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0">
        <div className="container mx-auto flex w-full items-center px-4 py-2">
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
        <section className="flex-1 overflow-hidden py-8">
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
            <div className="relative min-w-sm md:max-w-2xl">
              <div className="absolute top-0 left-0 w-xl overflow-hidden rounded-lg border shadow-lg md:relative">
                <div className="flex items-center gap-2 bg-linear-to-t from-slate-50 to-slate-200 px-2 py-1.5">
                  <span className="block h-4 w-4 rounded-full bg-red-500"></span>
                  <span className="block h-4 w-4 rounded-full bg-yellow-500"></span>
                  <span className="block h-4 w-4 rounded-full bg-green-500"></span>
                </div>
                <div className="overflow-hidden rounded">
                  <img src="/demo.webp" alt="ERP System" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
