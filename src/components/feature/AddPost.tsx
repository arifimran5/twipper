import React from "react";

const AddPost = () => {
  return (
    <div className="mt-4">
      <form className="mx-auto flex max-w-[30rem] flex-col rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-5">
        <div>
          <textarea
            placeholder="Add post.."
            className="h-20 w-full resize-none bg-transparent outline-none"
            name="post"
            id="post"
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
