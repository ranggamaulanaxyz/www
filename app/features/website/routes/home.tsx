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
    <div id="wrapper">
      <header className="container mx-auto px-4 py-2 flex items-center">
        <Link
          to="/"
          title="Rangga Maulana"
          className="flex items-center gap-2 h-12"
        >
          <img
            src="/logo42x42.png"
            className="h-10 rounded-full bg-slate-600 transition-all hover:bg-slate-500 duration-300 outline-2 outline-offset-1 outline-slate-700"
          />
          <span className="font-brand text-3xl text-slate-500 hover:text-slate-700 transition-colors duration-300 sm:inline-block hidden">
            Rangga
          </span>
        </Link>
        <div className="ml-auto">
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
        </div>
      </header>
      <main>
        <section className="container mx-auto p-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="text-center md:text-left sm:max-w-2xl lg:max-w-4xl">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl md:mb-4">
              Mengubah Alur Kerja Kompleks Menjadi Solusi Digital yang Intuitif
            </h1>
            <p className="mb-4 text-gray-600">
              Saya merancang dan membangun sistem perangkat lunak kustom yang
              menyederhanakan proses rumit, mengotomatisasi efisiensi bisnis,
              dan menghadirkan pengalaman pengguna tanpa hambatan.
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-4">
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
                  buttonVariants({ variant: "link" }),
                  "animate-pulse",
                )}
              >
                <BriefcaseBusinessIcon /> Lihat semua proyek saya
              </Link>
            </div>
          </div>
          <div className="md:max-w-2xl">
            <div className="border rounded-lg overflow-hidden shadow-lg">
              <div className="px-2 py-1.5 bg-linear-to-t from-slate-50 to-slate-200 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500 block"></span>
                <span className="w-4 h-4 rounded-full bg-yellow-500 block"></span>
                <span className="w-4 h-4 rounded-full bg-green-500 block"></span>
              </div>
              <div className="rounded overflow-hidden">
                <img src="/demo.webp" alt="ERP System" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
