import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

  getAllPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
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

  likePost: protectedProcedure
    .input(z.object({ userId: z.string().cuid(), postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.postLike.create({
        data: {
          postId: input.postId,
          userId: input.userId,
        },
      });
    }),
  removeLike: protectedProcedure
    .input(z.object({ userId: z.string().cuid(), postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const postLiked = await ctx.prisma.postLike.findFirst({
        where: {
          userId: input.userId,
          postId: input.postId,
        },
      });

      if (!postLiked) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "like not found" });
      }

      return await ctx.prisma.postLike.delete({
        where: {
          id: postLiked.id,
        },
      });
    }),
  savePost: protectedProcedure
    .input(z.object({ userId: z.string().cuid(), postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.postSave.create({
        data: {
          postId: input.postId,
          userId: input.userId,
        },
      });
    }),
  removeSave: protectedProcedure
    .input(z.object({ userId: z.string().cuid(), postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const postSaved = await ctx.prisma.postSave.findFirst({
        where: {
          userId: input.userId,
          postId: input.postId,
        },
      });

      if (!postSaved) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Save not found" });
      }

      return await ctx.prisma.postSave.delete({
        where: {
          id: postSaved.id,
        },
      });
    }),
});
