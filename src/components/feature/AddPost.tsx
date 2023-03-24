import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../general/Loading";

type PostInput = {
  post: string;
};

const AddPost = () => {
  const queryctx = api.useContext();
  const { register, handleSubmit, reset } = useForm<PostInput>();
  const { mutate, isLoading: isPosting } = api.post.createPost.useMutation({
    onSuccess: () => {
      reset();
      void queryctx.post.getAllPosts.invalidate();
      toast.success("Post created :)");
    },
    onError() {
      toast.error("Something went wrong");
    },
  });

  const submitPost: SubmitHandler<PostInput> = (data) => {
    if (data.post.length == 0) return;
    mutate({ content: data.post });
    console.log(data);
  };

  return (
    <div className="mt-8">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(submitPost)}
        className="mx-auto flex max-w-[36rem] flex-col rounded-lg border-2 border-gray-100 bg-gray-50  p-5"
      >
        <div>
          <textarea
            placeholder="Add post.."
            className="h-20 w-full resize-none bg-transparent outline-none"
            {...register("post", { required: true })}
            rows={5}
            disabled={isPosting}
          />
        </div>
        <button
          type="submit"
          className="self-end rounded-full bg-accent py-2 px-6 font-medium text-white"
          disabled={isPosting}
        >
          {isPosting ? <LoadingSpinner width={24} height={24} /> : "Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
