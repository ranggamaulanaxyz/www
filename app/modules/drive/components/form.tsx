import type { ValidationError } from "~/types";
import type { DriveSchema } from "../schemas";
import { useEffect, useState } from "react";
import { Form } from "react-router";
import DeskHeader from "~/components/desk/header";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import InputDateTime from "~/components/ui/input-datetime";

interface DriveFormViewProps {
  drive?: DriveSchema | null;
  initialFieldErrors?: ValidationError<DriveSchema>;
}
export default function DriveFormView({
  drive,
  initialFieldErrors,
}: DriveFormViewProps) {
  const getDefaultValues = (drive?: DriveSchema | null) => {
    return {
      name: drive?.name || "",
      description: drive?.description || "",
      createdAt: drive?.createdAt,
      updatedAt: drive?.updatedAt,
    };
  };
  const [field, setField] = useState<DriveSchema>(getDefaultValues(drive));
  useEffect(() => {
    setField(getDefaultValues(drive));
  }, [drive]);

  const [fieldErrors, setFieldError] = useState(initialFieldErrors);
  useEffect(() => {
    setFieldError(initialFieldErrors);
  }, [initialFieldErrors]);

  return (
    <Form method="post">
      <DeskHeader>
        <div className="ml-auto">
          <Button type="submit" size="icon-sm">
            <SaveIcon />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </DeskHeader>
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <FieldGroup>
                <Field data-invalid={!!fieldErrors?.name}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={field.name}
                    aria-invalid={!!fieldErrors?.name}
                  />
                  <FieldError errors={fieldErrors?.name} />
                </Field>
                <Field data-invalid={!!fieldErrors?.description}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    name="description"
                    defaultValue={field.description || ""}
                    aria-invalid={!!fieldErrors?.description}
                  />
                  <FieldError errors={fieldErrors?.description} />
                </Field>
                <Field data-invalid={!!fieldErrors?.createdAt}>
                  <FieldLabel>Created At</FieldLabel>
                  <InputDateTime
                    name="created_at"
                    value={field.createdAt || ""}
                    readOnly
                  />
                  <FieldError errors={fieldErrors?.createdAt} />
                </Field>
                <Field data-invalid={!!fieldErrors?.updatedAt}>
                  <FieldLabel>Updated At</FieldLabel>
                  <InputDateTime
                    name="updated_at"
                    value={field.updatedAt || ""}
                    readOnly
                  />
                  <FieldError errors={fieldErrors?.updatedAt} />
                </Field>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
