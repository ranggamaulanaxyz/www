import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function ProductSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peoduk</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button
          nativeButton={false}
          variant="link"
          size="sm"
          render={
            <Link to="/desk/products">
              Kelola Produk <ArrowRightIcon />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
