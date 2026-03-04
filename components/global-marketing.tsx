import { db } from "@/lib/db";
import { TopBannerClient } from "./top-banner-client";
import { OfferPopupClient } from "./offer-popup-client";

export const GlobalMarketing = async () => {
  const setting = await db.marketingSetting.findUnique({
    where: { id: "default" },
  });

  if (!setting) return null;

  return (
    <>
      <TopBannerClient setting={setting} />
      <OfferPopupClient setting={setting} />
    </>
  );
};
