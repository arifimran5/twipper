import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { DeleteIcon, EditIcon } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import EditPost from "../feature/EditPost";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuContent = DropdownMenu.Content;
const DropdownMenuItem = DropdownMenu.Item;

type PostSettingsMenuProps = {
  children: ReactNode;
  postId: string;
};

const PostSettingsMenu = ({ children, postId }: PostSettingsMenuProps) => {
  const { data: session } = useSession();
  const postQueryContext = api.useContext();

  const { mutate: deletePost } = api.post.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post Deleted");
      void postQueryContext.post.getAllPosts.invalidate();
      void postQueryContext.profile.getPostsByUser.invalidate();
      void postQueryContext.post.getOnePost.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (!session?.user) {
    return null;
  }

  return (
    <Dialog.Root>
      <DropdownMenuRoot>
        <DropdownMenuTrigger className="outline-none">
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            className="min-w-[120px] rounded-md bg-[#313131] bg-opacity-80 p-[5px] pt-5 pb-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            sideOffset={5}
          >
            <DropdownMenuItem className="flex  select-none items-center rounded-[3px] px-1  py-1 pl-3 font-medium text-white  outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
              <Link href={`/post/${postId}?edit=true`}>
                <button className="inline-flex items-center gap-2">
                  <EditIcon className="w-4" />
                  Edit
                </button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className=" flex select-none items-center rounded-[3px] px-1 py-1 pl-3 font-medium text-red-400 outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-500 data-[highlighted]:text-accent">
              <button
                onClick={() => deletePost({ postId, userId: session.user.id })}
                className="inline-flex items-center gap-2"
              >
                <DeleteIcon className="w-4" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </Dialog.Root>
  );
};

export default PostSettingsMenu;
