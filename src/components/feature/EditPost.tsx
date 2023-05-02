import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../general/Loading";
import type { PostWithAuthor } from "./PostList";
import Link from "next/link";
import { useRouter } from "next/router";

type PostInput = {
  post: string;
};
const EditPost = ({ post }: { post: PostWithAuthor }) => {
  const queryctx = api.useContext();
  const router = useRouter();
  const { register, handleSubmit, reset, setFocus } = useForm<PostInput>();
  const { mutate, isLoading: isUpdating } = api.post.editPost.useMutation({
    onSuccess: () => {
      reset();
      void queryctx.post.getOnePost.invalidate();
      void router.push(`/post/${post.id}`);
      toast.success("Post updated");
    },
    onError() {
      toast.error("Something went wrong");
    },
  });

  const submitPost: SubmitHandler<PostInput> = (data) => {
    if (data.post.length == 0) return;
    mutate({ content: data.post, postId: post.id });
  };
  return (
    <section className="absolute inset-0 flex min-h-screen items-center justify-center bg-black/90">
      <div className="mt-8 min-w-[20rem] sm:min-w-[30rem]">
        <form
          onClick={() => setFocus("post")}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitPost)}
          className="mx-auto flex max-w-[36rem] flex-col rounded-lg border-2 border-gray-100 bg-gray-50 p-5"
        >
          <div>
            <textarea
              defaultValue={post.content}
              placeholder="Add post.."
              className="h-20 w-full resize-none bg-transparent outline-none sm:h-40"
              {...register("post", { required: true, value: post.content })}
              rows={5}
              disabled={isUpdating}
            />
          </div>
          <div className="space-x-1 self-end">
            <Link href={`/post/${post.id}`} prefetch={false}>
              <button
                className="rounded-full bg-red-400 py-2 px-6 font-medium text-white"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="rounded-full bg-accent py-2 px-6 font-medium text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <LoadingSpinner width={24} height={24} />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
