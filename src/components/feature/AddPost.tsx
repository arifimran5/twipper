import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type PostInput = {
  post: string;
};

const AddPost = () => {
  const { mutate } = api.post.createPost.useMutation();
  const { register, handleSubmit, reset } = useForm<PostInput>();

  const submitPost: SubmitHandler<PostInput> = (data) => {
    if (data.post.length == 0) return;
    mutate({ content: data.post });
    console.log(data);
    reset();
  };

  return (
    <div className="mt-4">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(submitPost)}
        className="mx-auto flex max-w-[30rem] flex-col rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-5"
      >
        <div>
          <textarea
            placeholder="Add post.."
            className="h-20 w-full resize-none bg-transparent outline-none"
            {...register("post", { required: true })}
            rows={5}
          />
        </div>
        <button
          type="submit"
          className="self-end rounded-full bg-black py-2 px-6 text-white"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
