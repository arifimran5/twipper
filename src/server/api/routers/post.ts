import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.post.create({
        data: { content: input.content, authorId: ctx.session.user.id },
      });
      return {
        message: "post created",
      };
    }),
});
