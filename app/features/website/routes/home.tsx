import { cn } from "cn";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  ArrowRightIcon,
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
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import WebsiteNavbar from "../components/navbar";
import WebsiteWrapper from "../components/wrapper";
import WebsiteFooter from "../components/footer";

export function meta() {
  return [
    { title: "Rangga Maulana" },
    {
      name: "description",
      content:
        "Sederhanakan proses bisnismu yang terus berkembang. Dari pekerjaan manual hingga proses yang kompleks, saya membantu mengubahnya menjadi sistem digital yang lebih terstruktur, terintegrasi, dan mudah digunakan.",
    },
    {
      name: "keyword",
      content:
        "aplikasi, website, erp, kustom erp, kustom odoom, kustom erpnext, landing page, company profile, jasa website, aplikasi bisnis, aplikasi akunting gratis, aplikasi stok gratis, aplikasi inventori gratis",
    },
  ];
}

export default function Home() {
  return (
    <WebsiteWrapper>
      <WebsiteNavbar />
      <main className="flex flex-1 flex-col">
        <section className="flex-1 overflow-visible pt-8">
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 md:flex-row md:justify-between md:gap-8">
            <div className="text-center sm:max-w-2xl md:text-left lg:max-w-4xl">
              <h1 className="font-display text-3xl leading-tight md:mb-4 md:max-w-xl md:text-4xl lg:text-5xl">
                Sederhanakan Proses Bisnismu
              </h1>
              <p className="mb-6 font-light md:max-w-3xl md:text-lg lg:text-xl">
                Dari pekerjaan manual hingga proses yang kompleks, saya membantu
                mengubahnya menjadi sistem digital yang lebih terstruktur,
                terintegrasi, dan mudah digunakan.
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
              <div className="relative max-w-xs md:max-w-none">
                <div className="overflow-hidden rounded-full bg-slate-100">
                  <img src="/logo500x500.png" className="relative z-30" />
                </div>
                <div className="absolute top-0 z-10 aspect-square w-1/2 rounded-full bg-slate-200">
                  <div className="absolute right-0 bottom-full aspect-square w-1/2 rounded-full bg-slate-300"></div>
                </div>
                <div className="absolute right-0 bottom-4 z-40 w-1/2 md:top-3/4 md:w-3/4 lg:top-5/7 2xl:top-1/2 2xl:-left-1/2">
                  <div className="bg-primary text-primary-foreground relative rounded-2xl px-2 py-1.5 text-xs shadow-lg md:px-4 md:py-3 xl:text-sm">
                    Saya Rangga, software engineer dengan 6 tahun pengalaman.
                    <div className="bg-primary absolute -top-1 size-3 rotate-40 md:left-15 lg:left-25 2xl:top-auto 2xl:-right-1 2xl:bottom-3 2xl:left-auto 2xl:rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto py-8 pr-4 pl-8 md:py-15">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <WorkflowIcon className="-rotate-45" />
              </div>
              <div className="md:text-center md:text-lg">
                Ketika bisnis berkembang, pekerjaan yang awalnya sederhana bisa
                menjadi semakin banyak, manual, dan sulit dikontrol.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <LightbulbIcon className="-rotate-45" />
              </div>
              <div className="md:text-center md:text-lg">
                Saya membantu mengubah proses yang kompleks menjadi solusi
                digital yang lebih sederhana, terstruktur, dan terintegrasi.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <TrendingUpIcon className="-rotate-45" />
              </div>
              <div className="md:text-center md:text-lg">
                Dengan sistem yang tepat, pekerjaan menjadi lebih efisien,
                kontrol semakin baik, dan bisnis siap berkembang dengan fondasi
                digital yang kuat.
              </div>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="container mx-auto flex flex-col items-center gap-10 overflow-hidden md:flex-row">
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
            <div className="space-y-6 p-4 md:text-lg lg:text-xl">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl">
                Halo, Perkenalkan!
              </h2>
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
                  buttonVariants({ variant: "default" }),
                  "text-md h-12 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                )}
              >
                Hubungi Saya
              </Link>
            </div>
          </div>
        </section>
        <section className="">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative">
                <img
                  src="https://avatar.vercel.sh/shadcn1"
                  alt="Event cover"
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                  <CardAction>
                    <Badge>Terbaru</Badge>
                  </CardAction>
                  <CardTitle>Sistem Menejemen Donasi</CardTitle>
                  <CardDescription>
                    Sistem yang memudahkan penerimaan donasi yang terintegrasi
                    dengan pembayaran online.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" disabled={true}>
                    Lihat Aplikasi
                  </Button>
                </CardFooter>
              </Card>
              <Card className="relative">
                <img
                  src="https://avatar.vercel.sh/shadcn1"
                  alt="Event cover"
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                  <CardAction>
                    <Badge>Terbaru</Badge>
                  </CardAction>
                  <CardTitle>Aplikasi PPOB</CardTitle>
                  <CardDescription>
                    Aplikasi untuk mengelola penjualan pulsa, kuota dan produk
                    digital lainnya secara online.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" disabled={true}>
                    Lihat Aplikasi
                  </Button>
                </CardFooter>
              </Card>
              <Card className="relative">
                <img
                  src="https://avatar.vercel.sh/shadcn1"
                  alt="Event cover"
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                  <CardAction>
                    <Badge>Terbaru</Badge>
                  </CardAction>
                  <CardTitle>Sistem Menejemen Warung</CardTitle>
                  <CardDescription>
                    Sistem sederhana yang memudahkan pengelolaan warungmu dengan
                    fitur POS dan inventori.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" disabled={true}>
                    Lihat Aplikasi
                  </Button>
                </CardFooter>
              </Card>
              <Card className="relative">
                <img
                  src="https://avatar.vercel.sh/shadcn1"
                  alt="Event cover"
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                  <CardAction>
                    <Badge>Terbaru</Badge>
                  </CardAction>
                  <CardTitle>Kustom ERP</CardTitle>
                  <CardDescription>
                    Aplikasi ERP dengan module lengkap dan terintegrasi dengan
                    modul akunting, stok, POS, Manufaktur dan module lainnya.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" disabled={true}>
                    Lihat Aplikasi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground relative overflow-hidden px-6 py-12 md:px-12 md:py-16">
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl leading-tight md:text-4xl lg:text-5xl">
                  Punya proses bisnis yang ingin dibuat lebih sederhana?
                </h2>

                <p className="text-primary-foreground/80 mx-auto mt-5 max-w-2xl md:text-lg">
                  Ceritakan kebutuhan dan tantangan bisnis Anda. Kita diskusikan
                  bagaimana teknologi dapat membantu membuat proses kerja lebih
                  terstruktur, efisien, dan mudah dikelola.
                </p>

                <div className="mt-8">
                  <Link
                    to="/contact/me"
                    title="Hubungi saya"
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "text-md h-12 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                    )}
                  >
                    Hubungi Saya
                  </Link>
                </div>
              </div>

              <div className="absolute -top-24 -right-24 size-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-white/5" />
            </div>
          </div>
        </section>
      </main>
      <WebsiteFooter />
    </WebsiteWrapper>
  );
}
