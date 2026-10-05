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
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

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
        <section className="flex-1 overflow-visible pt-8">
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 md:flex-row md:justify-between md:gap-8">
            <div className="text-center sm:max-w-2xl md:text-left lg:max-w-4xl">
              <h1 className="font-display text-3xl leading-tight md:mb-4 md:max-w-xl md:text-4xl lg:text-5xl">
                Sederhanakan Proses Bisnismu
              </h1>
              <p className="mb-6 font-light md:max-w-3xl md:text-xl">
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
                <div className="absolute right-0 bottom-4 z-40 w-1/2 md:top-1/2 md:-left-1/4">
                  <div className="bg-primary text-primary-foreground relative rounded-2xl px-2 py-1.5 text-xs shadow-lg md:px-4 md:py-3 md:text-sm">
                    Saya Rangga, software engineer dengan 6 tahun pengalaman.
                    <div className="bg-primary absolute -top-1 size-3 rotate-40 md:top-auto md:-right-1 md:bottom-3 md:rotate-45" />
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
              <div className="text-slate-700 md:text-center md:text-lg">
                Ketika bisnis berkembang, pekerjaan yang awalnya sederhana bisa
                menjadi semakin banyak, manual, dan sulit dikontrol.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <LightbulbIcon className="-rotate-45" />
              </div>
              <div className="text-slate-700 md:text-center md:text-lg">
                Saya membantu mengubah proses yang kompleks menjadi solusi
                digital yang lebih sederhana, terstruktur, dan terintegrasi.
              </div>
            </div>
            <div className="group flex items-center gap-6 md:flex-col">
              <div className="flex aspect-square size-16 rotate-45 items-center justify-center bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-700 group-hover:text-white md:size-24">
                <TrendingUpIcon className="-rotate-45" />
              </div>
              <div className="text-slate-700 md:text-center md:text-lg">
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
            <div className="space-y-6 p-4 text-xl">
              <h2 className="font-display text-4xl">Halo, Perkenalkan!</h2>
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
                  <Button className="w-full">Lihat Aplikasi</Button>
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
                  <CardTitle>Sistem Menejemen Donasi</CardTitle>
                  <CardDescription>
                    Sistem yang memudahkan penerimaan donasi yang terintegrasi
                    dengan pembayaran online.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Lihat Aplikasi</Button>
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
                  <CardTitle>Sistem Menejemen Donasi</CardTitle>
                  <CardDescription>
                    Sistem yang memudahkan penerimaan donasi yang terintegrasi
                    dengan pembayaran online.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Lihat Aplikasi</Button>
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
                  <CardTitle>Sistem Menejemen Donasi</CardTitle>
                  <CardDescription>
                    Sistem yang memudahkan penerimaan donasi yang terintegrasi
                    dengan pembayaran online.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Lihat Aplikasi</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-lg px-6 py-12 md:px-12 md:py-16">
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
      <footer>
        <div className="container mx-auto">
          <div className="flex items-start justify-between p-4 text-sm text-gray-600">
            <span>
              &copy; {new Date().getFullYear()} Rangga Maulana. All rights
              reserved.
            </span>
            <ul className="flex items-center">
              <li>
                <a
                  href="https://www.linkedin.com/in/ranggamaulanaxyz"
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 680 850"
                    width="24"
                    height="24"
                    fill="#000000"
                    style={{ opacity: 1 }}
                  >
                    <path d="M165 90q0 35-21 59t-62 24q-37 0-59-24T0 95q0-35 23-61T83 8t60 24t22 58M0 750h165V214H0zm560-528q-32 0-57 8t-45 21t-33 27t-21 27h-4l-9-70H243q0 34 2 74t2 86v355h165V457q0-12 1-22t3-19q4-11 11-23t16-21t22-16t29-6q44 0 64 32t19 83v285h165V445q0-57-14-99t-38-70t-58-41t-72-13" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.github.com/ranggamaulanaxyz"
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    height="h-5"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/ranggamaulanaxyz"
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5"
                  >
                    <title>Instagram</title>
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.x.com/ranggamxyz"
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5"
                  >
                    <title>X</title>
                    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
