import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import WebsiteFooter from "../components/footer";
import WebsiteNavbar from "../components/navbar";
import WebsiteWrapper from "../components/wrapper";
import z from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

const schema = z.object({
  name: z
    .string("Nama tidak sah")
    .min(3, "Nama minimal 3 karakter")
    .max(32, "Nama maksimal 32 karakter"),
  email: z.email("Alamat email tidak sah."),
  message: z
    .string("Pesan tidak sah")
    .min(10, "Pesan minimal 10 karakter")
    .max(500, "Pesan maksimal 500 karakter"),
});

export function meta() {
  return [
    { title: "Kontak Saya" },
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

export default function Contact() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <WebsiteWrapper>
      <WebsiteNavbar />

      <main className="container mx-auto flex flex-1 flex-col justify-center px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4">
              <h1 className="font-display text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Mari Bicara Tentang Projek Anda
              </h1>

              <p className="leading-relaxed">
                Punya ide aplikasi, butuh kustomisasi ERP, atau ingin
                mendigitalkan proses bisnis Anda? Kirimkan pesan, saya akan
                membalasnya dalam 1x24 jam.
              </p>
            </div>

            <div className="border-border/60 space-y-4 border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Email Direct
                  </p>
                  <a
                    href="mailto:halo@domainanda.com"
                    className="text-sm font-semibold hover:underline"
                  >
                    me@ranggamaulana.xyz
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Lokasi
                  </p>
                  <p className="text-sm font-semibold">Batam / Remote</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm sm:p-8 md:shadow-md">
              <Form {...getFormProps(form)} className="space-y-6">
                <FieldGroup className="space-y-5">
                  <Field>
                    <FieldLabel htmlFor={fields.name.id}>
                      Nama Lengkap
                    </FieldLabel>
                    <Input
                      {...getInputProps(fields.name, { type: "text" })}
                      placeholder="Masukkan nama Anda"
                    />
                    {fields.name.errors && (
                      <FieldError>{fields.name.errors[0]}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={fields.email.id}>
                      Alamat Email
                    </FieldLabel>
                    <Input
                      {...getInputProps(fields.email, { type: "email" })}
                      placeholder="nama@perusahaan.com"
                    />
                    {fields.email.errors && (
                      <FieldError>{fields.email.errors[0]}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={fields.message.id}>
                      Pesan / Deskripsi Kebutuhan
                    </FieldLabel>
                    <Textarea
                      {...getTextareaProps(fields.message)}
                      rows={5}
                      placeholder="Ceritakan singkat tentang projek atau kebutuhan sistem bisnis Anda..."
                      className="resize-y"
                    />
                    {fields.message.errors && (
                      <FieldError>{fields.message.errors[0]}</FieldError>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full px-8 font-medium sm:w-auto"
                  >
                    Kirim Pesan
                  </Button>
                </FieldGroup>
              </Form>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </WebsiteWrapper>
  );
}
