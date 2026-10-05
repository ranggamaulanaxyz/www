import { cn } from "cn";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  LightbulbIcon,
  SendIcon,
  TrendingUpIcon,
  WorkflowIcon,
} from "lucide-react";
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
  const isScrolled = useIsScrolled(10);
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 p-1">
        <div
          className={cn(
            "container mx-auto flex w-full items-center rounded-lg px-4 py-2 transition-all",
            isScrolled
              ? "border bg-white/70 backdrop-blur-md"
              : "bg-transparent",
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
      <main className="flex flex-1 flex-col">
        <section className="flex-1 overflow-visible py-8">
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 md:flex-row md:justify-between md:gap-8">
            <div className="text-center sm:max-w-2xl md:text-left lg:max-w-4xl">
              <h1 className="font-display text-3xl leading-tight md:mb-4 md:max-w-xl md:text-4xl lg:text-5xl">
                Digitalisasi Bisnismu Sekarang!
              </h1>
              <p className="mb-6 text-lg font-light md:max-w-3xl md:text-xl">
                Saya merancang dan membangun sistem perangkat lunak kustom yang
                menyederhanakan proses rumit, mengotomatisasi efisiensi bisnis,
                dan menghadirkan pengalaman pengguna tanpa hambatan.
              </p>
              <div className="space-y-2 text-left">
                <div className="mb-2 flex items-center justify-center gap-2 md:mb-4 md:justify-start">
                  <InputGroup className="h-12 max-w-lg">
                    <InputGroupInput
                      className="md:text-md"
                      placeholder="MASUKAN EMAIL KAMU UNTUK KONSULTASI"
                      type="email"
                      required
                    />
                    <InputGroupAddon align="inline-end" className="pr-0">
                      <InputGroupButton
                        className="md:text-md h-12 px-4"
                        variant="default"
                      >
                        <SendIcon />
                        <span className="hidden md:inline">
                          KONSULTASI GRATIS
                        </span>
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
        <section className="container mx-auto rounded-t-4xl border-t py-15 pr-4 pl-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <WorkflowIcon className="-rotate-45" />
              </div>
              <div className="text-slate-700 md:text-center md:text-lg">
                Bisnismu berkembang, tetapi proses kerja masih bergantung pada
                cara lama.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <LightbulbIcon className="-rotate-45" />
              </div>
              <div className="text-slate-700 md:text-center md:text-lg">
                Saya bisa membantu mengubah proses yang kompleks menjadi sistem
                digital yang lebih sederhana, terstruktur, dan terintegrasi.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <TrendingUpIcon className="-rotate-45" />
              </div>
              <div className="text-slate-700 md:text-center md:text-lg">
                Lebih sedikit pekerjaan manual, lebih banyak kontrol, dan bisnis
                yang siap berkembang dengan fondasi digital yang kuat.
              </div>
            </div>
          </div>
        </section>
        <section className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto flex flex-col items-center gap-10 md:flex-row">
            <div className="p-4 md:max-w-sm">
              <div className="relative z-0">
                <img
                  src="/me.jpg"
                  alt="Rangga"
                  className="relative z-50 object-cover outline outline-offset-1"
                />
                <div className="absolute top-4 left-5 z-0 h-full w-full border border-gray-500"></div>
                <div className="absolute top-1 left-3 z-0 h-full w-full border border-gray-300"></div>
              </div>
            </div>
            <div className="space-y-6 p-4 text-xl">
              <h2 className="font-display text-4xl">Rangga Maulana</h2>
              <p>
                Saya Rangga Maulana, developer software bisnis dengan pengalaman
                6+ tahun. Saya fokus membantu menyederhanakan alur kerja bisnis
                yang kompleks agar lebih simpel dan mudah dikelola.
              </p>
              <p>
                Saya melayani pembuatan Website Landing Page & CMS untuk
                branding, serta Kustomisasi ERP (Akuntansi, Invoicing, Sales,
                Purchase, Inventory) yang disesuaikan presisi dengan alur bisnis
                Anda.
              </p>
              <p>
                Ingin operasional bisnis jadi lebih mudah? Yuk, diskusikan
                kebutuhan sistem Anda dengan Saya!
              </p>
              <Link
                to="/contact/me"
                title="Hubungi saya"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "text-md h-12 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                )}
              >
                Hubungi Saya
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
