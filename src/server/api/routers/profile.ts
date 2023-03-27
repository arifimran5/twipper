import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfileByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return user;
    }),

  getPostsByUser: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          author: {
            username: input.username,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          likes: true,
          PostSave: true,
          author: {
            select: { id: true, image: true, username: true },
          },
        },
      });

      return posts;
    }),
  getLikedPostByUser: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.postLike.findMany({
        where: {
          user: {
            username: input.username,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            include: {
              likes: true,
              PostSave: true,
              author: {
                select: { id: true, image: true, username: true },
              },
            },
          },
        },
      });
    }),
  getSavedPostByUser: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.postSave.findMany({
        where: {
          user: {
            username: input.username,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            include: {
              likes: true,
              PostSave: true,
              author: {
                select: { id: true, image: true, username: true },
              },
            },
          },
        },
      });
    }),
});
