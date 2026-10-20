import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Partners } from "../types/partner";
import { useSupabase } from "~/contexts/supabase";
import { getPartnerSummary } from "../services/partner";
import { getInitials } from "~/utils/tools";
import { Button } from "~/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function PartnerSummaryCard() {
  const supabase = useSupabase();
  const [partners, setPartners] = useState<Partners>([]);
  const [estimatedCount, setEstimatedCount] = useState(0);

  useEffect(() => {
    getPartnerSummary(supabase).then(({ partners, count }) => {
      setPartners(partners);
      setEstimatedCount(count || 0);
    });
  }, [supabase]);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Kontak</CardTitle>
      </CardHeader>
      <CardContent>
        <AvatarGroup>
          {partners.map((partner) => (
            <Avatar
              key={partner.id}
              render={
                <Link to={`/desk/partners/${partner.id}`} title={partner.name}>
                  <AvatarImage
                    src={partner.image || undefined}
                    alt={partner.name}
                  />
                  <AvatarFallback>
                    {getInitials(partner.name, 2)}
                  </AvatarFallback>
                </Link>
              }
            />
          ))}
          <AvatarGroupCount>
            <Link to="/desk/partners" title="Daftar Kontak">
              +{estimatedCount - partners.length}
            </Link>
          </AvatarGroupCount>
        </AvatarGroup>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          nativeButton={false}
          size="sm"
          render={
            <Link to="/desk/partners" title="Daftar Kontak">
              Lihat Kontak Lainnya <ArrowRightIcon />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}
