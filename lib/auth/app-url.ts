import { headers } from "next/headers";
import { env } from "@/env";

export async function getAppOrigin() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (host) {
    const protocol =
      headersList.get("x-forwarded-proto") ??
      (host.startsWith("localhost") ? "http" : "https");
    return `${protocol}://${host}`;
  }

  return env.NEXT_PUBLIC_APP_URL;
}