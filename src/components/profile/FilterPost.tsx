import { api } from "@/utils/api";
import { Heart, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "next-auth";
import type { Post, PostLike, PostSave } from "@prisma/client";
import { LoadingBlock } from "../general/Loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import { PostWithAuthor } from "../feature/PostList";

type PostWithAuthor = Post & {
  likes: PostLike[];
  PostSave: PostSave[];
  author: {
    id: string;
    image: string | null;
    username: string;
  };
};

type PostWithLikes = PostLike & {
  post: PostWithAuthor;
};

dayjs.extend(relativeTime);

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
    return <LoadingBlock />;
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

type PostCardProps = {
  post: PostWithAuthor;
  user: User;
};
export const PostCard = ({ post, user }: PostCardProps) => {
  // likes and saves count
  const [likes, setLikes] = useState(post.likes.length);
  const [saves, setSaves] = useState(post.PostSave.length);

  //liked by user
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(() =>
    post.likes.find((e) => e.userId === user.id) ? true : false
  );

  //saved by user
  const [savedByCurrentUser, setSavedByCurrentUser] = useState(() =>
    post.PostSave.find((e) => e.userId === user.id) ? true : false
  );

  const queryCtx = api.useContext();

  // liking
  const { mutate: likePost } = api.post.likePost.useMutation({
    onError: () => toast.error("Failed to like"),
  });
  const { mutate: removeLike } = api.post.removeLike.useMutation({
    onSuccess: () => void queryCtx.profile.getLikedPostByUser.invalidate(),
  });

  // saving
  const { mutate: savePost } = api.post.savePost.useMutation({
    onError: () => toast.error("Failed to save"),
  });
  const { mutate: removeSave } = api.post.removeSave.useMutation({
    onSuccess: () => void queryCtx.profile.getSavedPostByUser.invalidate(),
  });

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

  const handleSave = () => {
    if (!savedByCurrentUser) {
      savePost({ postId: post.id, userId: user.id });
      setSaves((prev) => prev + 1);
      setSavedByCurrentUser(true);
    } else {
      removeSave({ postId: post.id, userId: user.id });
      setSaves((prev) => prev - 1);
      setSavedByCurrentUser(false);
    }
  };

  return (
    <div className="flex gap-2 rounded-lg border-2 border-gray-100 bg-gray-50 p-3 sm:gap-4">
      <div className="shrink-0">
        {/* {!post.author.image && <span>No img</span>} */}
        {post.author.image && (
          <Link prefetch={false} href={`/@${post.author.username}`}>
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
          <Link
            prefetch={false}
            href={`/@${post.author.username}`}
            className="font-semibold"
          >
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
                likedByCurrentUser ? "fill-red-500 text-red-500" : ""
              }`}
            />{" "}
            <span>{likes}</span>
          </button>
          <button className="inline-flex gap-1">
            <Save
              onClick={handleSave}
              className={`w-5 ${savedByCurrentUser ? "text-accent" : ""}`}
            />{" "}
            <span>{saves}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
