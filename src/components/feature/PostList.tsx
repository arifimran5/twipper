import { api } from "@/utils/api";
import { LoadingBlock } from "../general/Loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Post } from "@prisma/client";

dayjs.extend(relativeTime);
const PostList = () => {
  const { data: posts, isLoading } = api.post.getAllPosts.useQuery();

  if (isLoading) {
    return <LoadingBlock />;
  }
  if (!posts) return <div></div>;

  return (
    <>
      <main className="mx-auto mt-8 flex max-w-[36rem] flex-col gap-4">
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

type PostProps = {
  post: Post & {
    author: Author;
  };
};

type Author = {
  id: string;
  image: string | null;
  username: string;
};

import { Heart, Save } from "lucide-react";
const PostCard = (props: PostProps) => {
  const { post } = props;

  if (!post.author.image) return <div></div>;

  return (
    <div className="flex gap-2 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 sm:gap-4">
      <div className="shrink-0">
        {/* {!post.author.image && <span>No img</span>} */}
        {post.author.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="w-10 rounded-full sm:w-12"
            src={post.author.image}
            alt="userprofile"
          />
        )}
      </div>
      <div className="mt-1 sm:mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <b className="font-semibold">{post.author.username}</b>
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
