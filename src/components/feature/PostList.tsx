import { LoadingBlock } from "../general/Loading";
import type { Post, PostLike, PostSave } from "@prisma/client";
import { useSession } from "next-auth/react";
import { PostCard } from "./PostCard";

export type PostWithAuthor = Post & {
  likes: PostLike[];
  PostSave: PostSave[];
  author: {
    id: string;
    image: string | null;
    username: string;
  };
};

const PostList = ({
  posts,
  isLoading,
}: {
  posts: PostWithAuthor[] | undefined;
  isLoading: boolean;
}) => {
  const { data: session } = useSession();

  if (!session || !session.user) return null;
  if (isLoading) {
    return <LoadingBlock />;
  }
  if (!posts) return <div></div>;

  return (
    <>
      <main className="mx-auto mt-4 flex max-w-[36rem] flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} user={session?.user} />
          </div>
        ))}
      </main>
    </>
  );
};

export default PostList;
