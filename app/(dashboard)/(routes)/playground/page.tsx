import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { PlaygroundClient } from "./_components/playground-client";

export const metadata = {
  title: "Playground | CodeSandbox",
  description: "Code playground for EdVerce students",
};

const PlaygroundPage = () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return <PlaygroundClient />;
};

export default PlaygroundPage;
