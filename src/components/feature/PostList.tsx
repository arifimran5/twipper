import { LoadingBlock } from "../general/Loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Post, PostLike } from "@prisma/client";

type PostWithAuthor = Post & {
  likes: PostLike[];
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

import { Heart, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import type { User } from "next-auth";
const PostCard = ({ post, user }: { post: PostWithAuthor; user: User }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(() =>
    post.likes.find((e) => e.userId === user.id) ? true : false
  );

  const { mutate: likePost } = api.post.likePost.useMutation({
    onError: () => toast.error("Failed to like"),
  });

  const { mutate: removeLike } = api.post.removeLike.useMutation();

  if (!post.author.image) return <div></div>;

  const handleLike = () => {
    if (!likedByCurrentUser) {
      likePost({ postId: post.id, userId: user.id });
      setLikes((prev) => prev + 1);
      setLikedByCurrentUser(true);
    } else {
      removeLike({ postId: post.id, userId: user.id });
      setLikes((prev) => prev - 1);
      setLikedByCurrentUser(false);
    }
  };

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
          <button className="inline-flex gap-1">
            <Heart
              onClick={handleLike}
              className={`w-5 ${
                likedByCurrentUser ? "fill-red-400 text-red-400" : ""
              }`}
            />{" "}
            <span>{likes}</span>
          </button>
          <button className="inline-flex gap-1">
            <Save className="w-5" /> <span>{0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
