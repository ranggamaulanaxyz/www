import { parseForm } from "~/utils/request";
import { accountMoveItemFormSchema } from "../schemas/account-move-item";
import { getFormProps, useForm } from "@conform-to/react";
import { useAccountMoveField } from "../hooks/use-account-move";
import { useAccountField } from "../hooks/use-account";
import { usePartnerField } from "~/features/partner/hooks/use-partner";
import { useProductField } from "~/features/product/hooks/use-product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "react-router";
import { FieldGroup } from "~/components/ui/field";
import { FieldText } from "~/components/form/fields/input";
import { FieldCombobox } from "~/components/form/fields/combobox";

export function AccountMoveItemCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, fields] = useForm({
    defaultValue: {
      name: "",
      moveId: "",
      accountId: "",
      partnerId: "",
      productId: "",
      debit: "0",
      credit: "0",
    },
    onValidate({ formData }) {
      return parseForm(formData, { schema: accountMoveItemFormSchema });
    },
  });

  const moveField = useAccountMoveField(fields.moveId);
  const accountField = useAccountField(fields.accountId);
  const partnerField = usePartnerField(fields.partnerId);
  const productField = useProductField(fields.productId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...getFormProps(form)} method="post">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baris Jurnal Baru</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <FieldText field={fields.name} label="Deskripsi" />
            <FieldCombobox {...moveField} label="Entri Jurnal" />
            <FieldCombobox {...accountField} label="Akun" />
            <FieldCombobox {...partnerField} label="Kontak" />
            <FieldCombobox {...productField} label="Produk" />
            <div className="grid grid-cols-2 gap-2">
              <FieldText
                field={fields.debit}
                label="Debit"
                type="number"
                min={0}
                step="any"
                align="right"
              />
              <FieldText
                field={fields.credit}
                label="Kredit"
                type="number"
                min={0}
                step="any"
                align="right"
              />
            </div>
          </FieldGroup>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
