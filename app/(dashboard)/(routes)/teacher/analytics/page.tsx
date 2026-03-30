import dynamic from "next/dynamic";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { AnalyticsLoading } from "./_components/analytics-loading";

const AnalyticsClient = dynamic(
  () => import("./_components/analytics-client"),
  {
    ssr: false,
    loading: () => (
      <AnalyticsLoading fullScreen label="Booting the analytics dashboard..." />
    ),
  },
);

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return <AnalyticsClient />;
};

export default AnalyticsPage;
