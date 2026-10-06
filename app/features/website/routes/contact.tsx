import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import WebsiteFooter from "../components/footer";
import WebsiteNavbar from "../components/navbar";
import WebsiteWrapper from "../components/wrapper";
import z from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
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

export default function Contact() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <WebsiteWrapper>
      <WebsiteNavbar />
      <main className="flex-1">
        <div className="container mx-auto">
          <Form {...getFormProps(form)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input {...getInputProps(fields.name, { type: "text" })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
                <Input {...getInputProps(fields.email, { type: "email" })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
                <Textarea {...getInputProps(fields.email, { type: "email" })} />
              </Field>
              <Field>
                <Button type="submit" size="lg">
                  Kirim
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        </div>
      </main>
      <WebsiteFooter />
    </WebsiteWrapper>
  );
}
