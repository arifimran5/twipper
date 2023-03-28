import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import type { Session } from "next-auth";

export const generateSSG = (session: Session | null) => {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: session },
    transformer: superjson,
  });
};
