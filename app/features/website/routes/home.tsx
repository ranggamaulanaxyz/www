import { cn } from "cn";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import { BriefcaseBusinessIcon } from "lucide-react";
import WebsiteNavbar from "../components/navbar";
import WebsiteWrapper from "../components/wrapper";
import WebsiteFooter from "../components/footer";
import TechStackCarousel from "../components/tech-stack-carousel";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";

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
        <section className="-mt-16 flex min-h-dvh flex-1 flex-col justify-end space-y-8 overflow-visible py-6 md:space-y-34 md:py-16">
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 md:flex-row md:justify-between md:gap-8">
            <div className="text-center sm:max-w-2xl md:self-center md:text-left lg:max-w-4xl">
              <h1 className="font-display text-3xl leading-tight font-bold tracking-wider md:mb-4 md:max-w-3xl md:text-4xl lg:text-6xl">
                SOFTWARE ENGINEER
              </h1>
              <p className="mb-6 leading-normal font-light tracking-wide md:max-w-2xl md:text-lg lg:text-xl">
                Halo! Saya Rangga Maulana siap membantu pertumbuhan bisnismu
                dengan solusi digital.
              </p>
              <div className="space-y-2 text-left">
                <div className="mb-2 flex items-center justify-center gap-2 md:mb-4 md:justify-start">
                  <Button
                    nativeButton={false}
                    size="lg"
                    className="h-10 flex-1 text-sm font-normal tracking-wider md:flex-none"
                    render={<Link to="/my/contact">KONTAK SAYA</Link>}
                  />
                  <Button
                    nativeButton={false}
                    variant="link"
                    size="lg"
                    className="h-10 text-sm font-normal tracking-wider"
                    render={
                      <Link to="/my/projects">
                        <BriefcaseBusinessIcon /> PROYEK SAYA
                      </Link>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Item>
                  <div className="text-background bg-foreground flex size-10 items-center justify-center rounded-full text-2xl font-bold">
                    7+
                  </div>
                  <ItemContent>
                    <ItemTitle>Pengalaman</ItemTitle>
                    <ItemDescription>
                      di Bussiness Application Development
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <div className="text-background bg-foreground flex size-10 items-center justify-center rounded-full text-2xl font-bold">
                    10
                  </div>
                  <ItemContent>
                    <ItemTitle>Proyek</ItemTitle>
                    <ItemDescription>
                      Accounting Software, Company Profile, Portofolio.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <div className="text-background bg-foreground flex size-10 items-center justify-center rounded-full text-2xl font-bold">
                    9+
                  </div>
                  <ItemContent>
                    <ItemTitle>Keahlian</ItemTitle>
                    <ItemDescription>
                      Odoo, React, REST API, UI/UX, Cloudflare, dll.
                    </ItemDescription>
                  </ItemContent>
                </Item>
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
              </div>
            </div>
          </div>
          <div>
            <TechStackCarousel />
          </div>
        </section>
        <section className="flex flex-1 flex-col justify-center py-6 md:py-16">
          <div className="container mx-auto p-4">
            <h2 className="font-display text-xl font-semibold md:text-2xl lg:text-4xl">
              TENTANG SAYA
            </h2>
            <div className="bg-background flex flex-col items-center gap-10 md:flex-row md:items-start">
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
              <div className="space-y-6 p-4 leading-relaxed font-light tracking-wider md:text-lg lg:text-xl">
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl">
                  Halo, Perkenalkan!
                </h2>
                <p>
                  Saya Rangga Maulana, pengembang perangkat lunak dengan 7+
                  tahun pengalaman dalam pengembangan aplikasi bisnis.
                </p>
                <p>
                  Saya membantu pertumbuhan bisnismu dengan solusi digital
                  seperti aplikasi kasir, penjualan dan pembelian, inventori
                  hingga akuntansi yang terintegrasi satu sama lain.
                </p>
                <p>
                  Selain itu saya juga membantu dalam pengembangan website dari
                  profil perusahaan hingga toko online untuk meningkat
                  pendapatan bisnis Anda.
                </p>
                <p>Silahkan hubungi saya untuk berdiskusi lebih lanjut.</p>
                <Link
                  to="/my/contact"
                  title="Kontak saya"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-10 gap-1.5 px-4 text-base font-light tracking-normal uppercase has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                  )}
                >
                  KONTAK SAYA
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="pt-8 md:py-16">
          <div className="container mx-auto md:px-4">
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
                    to="/my/contact"
                    title="Hubungi saya"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "h-10 gap-1.5 px-3 text-base font-normal has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                    )}
                  >
                    HUBUNGI SAYA
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
