import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function AccountingSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keuangan</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button
          nativeButton={false}
          variant="link"
          size="sm"
          render={
            <Link to="/desk/accounting">
              Kelola Keuangan <ArrowRightIcon />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
