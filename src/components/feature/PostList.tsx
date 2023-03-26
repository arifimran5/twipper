import { LoadingBlock } from "../general/Loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Post } from "@prisma/client";

type PostWithAuthor = Post & {
  author: {
    id: string;
    image: string | null;
    username: string;
  };
};

dayjs.extend(relativeTime);

const PostList = ({
  posts,
  isLoading,
}: {
  posts: PostWithAuthor[] | undefined;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <LoadingBlock />;
  }
  if (!posts) return <div></div>;

  return (
    <>
      <main className="mx-auto mt-4 flex max-w-[36rem] flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </main>
    </>
  );
};

export default PostList;

import { Heart, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const PostCard = ({ post }: { post: PostWithAuthor }) => {
  if (!post.author.image) return <div></div>;

  return (
    <div className="flex gap-2 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 sm:gap-4">
      <div className="shrink-0">
        {/* {!post.author.image && <span>No img</span>} */}
        {post.author.image && (
          <Link href={`/@${post.author.username}`}>
            <Image
              width={40}
              height={40}
              className="rounded-full sm:w-12"
              src={post.author.image}
              alt="userprofile"
            />
          </Link>
        )}
      </div>
      <div className="mt-1 sm:mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <Link href={`/@${post.author.username}`} className="font-semibold">
            {post.author.username}
          </Link>
          <span className="text-sm text-gray-400">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <p className="mt-2">{post.content}</p>

        <div className="mt-6 flex items-center gap-3 text-gray-400">
          <button>
            <Heart className="w-5" />
          </button>
          <button>
            <Save className="w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
