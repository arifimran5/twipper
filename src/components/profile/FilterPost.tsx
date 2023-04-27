import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import type { PostLike } from "@prisma/client";
import { PostLoadingSkeleton } from "../general/Loading";
import { PostCard } from "../feature/PostCard";
import type { PostWithAuthor } from "../feature/PostList";

type PostWithLikes = PostLike & {
  post: PostWithAuthor;
};

export const LikedPostList = ({ username }: { username: string }) => {
  const { data: posts, isLoading } = api.profile.getLikedPostByUser.useQuery({
    username,
  });
  return (
    <>
      <PostList posts={posts} isLoading={isLoading} />
    </>
  );
};

export const SavedPostList = ({ username }: { username: string }) => {
  const { data: posts, isLoading } = api.profile.getSavedPostByUser.useQuery({
    username,
  });
  return (
    <>
      <PostList posts={posts} isLoading={isLoading} />
    </>
  );
};

const PostList = ({
  posts,
  isLoading,
}: {
  posts: PostWithLikes[] | undefined;
  isLoading: boolean;
}) => {
  const { data: session } = useSession();

  if (!session || !session.user) return null;
  if (isLoading) {
    return <PostLoadingSkeleton />;
  }
  if (!posts) return <div></div>;

  return (
    <>
      <main className="mx-auto mt-4 flex max-w-[36rem] flex-col gap-4">
        {posts.map((post) => (
          <div key={post.post.id}>
            <PostCard post={post.post} user={session?.user} />
          </div>
        ))}
      </main>
    </>
  );
};
