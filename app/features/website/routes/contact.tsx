import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import WebsiteFooter from "../components/footer";
import WebsiteNavbar from "../components/navbar";
import WebsiteWrapper from "../components/wrapper";
import z, { success } from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { data, Form, useNavigation } from "react-router";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/contact";
import { resendMiddleware } from "~/middlewares.server";
import { resendContext } from "~/context";
import { parseForm } from "~/utils/request";
import { sendContactEmail } from "../services/website";
import { verifyTurnstile } from "../services/turnstile.server";
import TurnstileWidget from "../components/turnstile";
import { useEffect, useState } from "react";
import { CheckCircleIcon, LoaderCircleIcon, SendIcon } from "lucide-react";

const TURNSTILE_SITE_KEY = "0x4AAAAAAGB8ZnXU6wVdVoJQ";
const TURNSTILE_ACTION = "contact";

const schema = z.object({
  name: z
    .string("Nama tidak valid.")
    .min(3, "Nama minimal 3 karakter.")
    .max(32, "Nama maksimal 32 karakter."),
  email: z.email("Alamat email tidak valid."),
  subject: z.string("Subjek tidak valid.").min(3, "Subjek minimal 3 karakter."),
  message: z
    .string("Pesan tidak valid.")
    .min(10, "Pesan minimal 10 karakter.")
    .max(500, "Pesan maksimal 500 karakter."),
  "cf-turnstile-response": z.string("Turnstile token tidak valid."),
});

export const middleware = [
  resendMiddleware,
] satisfies Route.MiddlewareFunction[];

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

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const resend = context.get(resendContext);

  const isHuman = await verifyTurnstile({
    token: formData.get("cf-turnstile-response"),
    action: TURNSTILE_ACTION,
    remoteIp: request.headers.get("CF-Connecting-IP"),
  });

  if (!isHuman) {
    return data(
      {
        success: false,
        lastResult: submission.reply({
          formErrors: ["Verifikasi keamanan gagal. Silakan coba lagi."],
        }),
      },
      { status: 403 },
    );
  }

  await sendContactEmail(resend, submission.value);

  return { success: true, lastResult: submission.reply({ resetForm: true }) };
}

export default function Contact({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult ?? null,
    onValidate({ formData }) {
      return parseForm(formData, { schema });
    },
  });

  const navigation = useNavigation();
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const isBusy = navigation.state !== "idle";
  const isSuccess = !isBusy && status === "success";

  useEffect(() => {
    if (!actionData?.success) return;

    setStatus("success");
    const timeout = setTimeout(() => setStatus("idle"), 2000);

    return () => clearTimeout(timeout);
  }, [actionData]);

  return (
    <WebsiteWrapper>
      <WebsiteNavbar />

      <main className="container mx-auto flex flex-1 flex-col px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-8 font-light lg:col-span-7">
            <div className="space-y-4">
              <h1 className="font-display text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-xl lg:text-6xl">
                KONTAK SAYA
              </h1>

              <div className="leading-relaxed">
                <p>Anda dapat menghubungi kontak saya dibawah ini.</p>
              </div>
            </div>

            <div className="space-y-4 ps-4">
              <div className="flex items-center gap-4">
                <div className="bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
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
                    Alamat Email
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
                <div className="bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
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

          <div className="lg:col-span-5">
            <Form {...getFormProps(form)} method="post" className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={fields.name.id} className="text-sm">
                    Nama
                  </FieldLabel>
                  <Input
                    {...getInputProps(fields.name, { type: "text" })}
                    placeholder="Masukkan nama Anda"
                    className="h-10 md:text-sm"
                  />
                  {fields.name.errors && (
                    <FieldError>{fields.name.errors[0]}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor={fields.email.id} className="text-sm">
                    Alamat Email
                  </FieldLabel>
                  <Input
                    {...getInputProps(fields.email, { type: "email" })}
                    placeholder="email@example.com"
                    className="h-10 md:text-sm"
                  />
                  {fields.email.errors && (
                    <FieldError>{fields.email.errors[0]}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor={fields.subject.id} className="text-sm">
                    Subjek
                  </FieldLabel>
                  <Input
                    {...getInputProps(fields.subject, { type: "text" })}
                    placeholder="Subjek"
                    className="h-10 md:text-sm"
                  />
                  {fields.subject.errors && (
                    <FieldError>{fields.subject.errors[0]}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor={fields.message.id} className="text-sm">
                    Pesan
                  </FieldLabel>
                  <Textarea
                    {...getTextareaProps(fields.message)}
                    rows={12}
                    placeholder="Pesan bisa mengenai tentang pertanyaan atau aplikasi yang ingin anda buat."
                    className="h-32 resize-y md:text-sm"
                  />
                  {fields.message.errors && (
                    <FieldError>{fields.message.errors[0]}</FieldError>
                  )}
                </Field>

                <Field>
                  <TurnstileWidget
                    sitekey={TURNSTILE_SITE_KEY}
                    action={TURNSTILE_ACTION}
                    resetKey={actionData}
                  />
                  {form.errors && <FieldError>{form.errors[0]}</FieldError>}
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full px-8 font-medium sm:w-auto"
                  disabled={isBusy}
                >
                  <span className="inline-grid place-items-center">
                    <span
                      aria-hidden
                      className="invisible col-start-1 row-start-1 flex items-center gap-1.5"
                    >
                      <CheckCircleIcon /> BERHASIL TERKIRIM
                    </span>

                    <span
                      key={isBusy ? "sending" : isSuccess ? "success" : "idle"}
                      aria-live="polite"
                      className="animate-in fade-in-0 zoom-in-95 col-start-1 row-start-1 flex items-center gap-1.5 duration-200"
                    >
                      {isBusy ? (
                        <>
                          <LoaderCircleIcon className="animate-spin" />{" "}
                          MENGIRIM...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircleIcon /> BERHASIL TERKIRIM
                        </>
                      ) : (
                        <>
                          <SendIcon /> KIRIM PESAN
                        </>
                      )}
                    </span>
                  </span>
                </Button>
              </FieldGroup>
            </Form>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </WebsiteWrapper>
  );
}
