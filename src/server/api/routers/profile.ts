import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfileByUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const userProfile = await ctx.prisma.userProfile.findFirst({
        where: {
          User: {
            username: input.username,
          },
        },
      });

      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const data = {
        image: user.image,
        username: user.username,
        name: userProfile?.name ? userProfile.name : user.name,
        bio: userProfile?.bio,
        website: userProfile?.website,
      };
      return data;
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
  // user settings ->

  getInitialProfile: protectedProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
      });
      const userProfile = await ctx.prisma.userProfile.findFirst({
        where: { userId: input.userId },
      });

      return {
        name: userProfile?.name ? userProfile.name : user?.name,
        bio: userProfile?.bio,
        website: userProfile?.website,
      };
    }),

  updateUserProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string().optional(),
        website: z.string().optional(),
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.userProfile.upsert({
        where: { userId: input.userId },
        update: { name: input.name, bio: input.bio, website: input.website },
        create: {
          name: input.name,
          bio: input.bio,
          website: input.website,
          User: {
            connect: {
              id: input.userId,
            },
          },
        },
      });

      return "updated user";
    }),
});
