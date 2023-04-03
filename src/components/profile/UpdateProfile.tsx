import { api } from "@/utils/api";
import type { Session } from "next-auth";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { LoadingBlock } from "../general/Loading";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type UpdateProfileForm = {
  name: string;
  bio?: string;
  website?: string;
};

const UpdateProfile = ({ session }: { session: Session }) => {
  // const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileForm>();

  const { data: initialProfile, isLoading } =
    api.profile.getInitialProfile.useQuery({
      userId: session.user.id,
    });

  const { mutate: updateProfile } = api.profile.updateUserProfile.useMutation({
    onSuccess: () => {
      toast.success("User Profile Updated");
      void router.replace(`/@${session.user.username}`);
    },
  });

  if (isLoading) {
    return <LoadingBlock />;
  }

  const submitProfileForm: SubmitHandler<UpdateProfileForm> = (data) => {
    console.log(data);
    updateProfile({
      name: data.name,
      bio: data.bio,
      website: data.website,
      userId: session.user.id,
    });
  };

  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submitProfileForm)} className="space-y-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="full_name">Name</label>
          <input
            defaultValue={initialProfile?.name as string}
            placeholder="John Doe"
            {...register("name", {
              maxLength: {
                value: 30,
                message: "Name should not be more than 30 characters long",
              },
              minLength: {
                value: 1,
                message: "Name should be at least 1 character long",
              },
            })}
            type="text"
            id="full_name"
            className="h-12 w-full rounded-md bg-gray-100 px-3 outline-none"
          />
          {errors.name && (
            <span className="font-mono text-red-500">
              😿 {errors.name.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio">Bio</label>
          <input
            defaultValue={initialProfile?.bio as string}
            type="text"
            {...register("bio", {
              maxLength: {
                value: 100,
                message: "Bio should not be more than 100 length",
              },
              minLength: {
                value: 4,
                message: "Bio should be minimum of 4 length",
              },
            })}
            id="bio"
            className="h-12 w-full rounded-md bg-gray-100 px-3 outline-none"
          />
          {errors.bio && (
            <span className="font-mono text-red-500">
              😿 {errors.bio.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="website">Website</label>
          <input
            placeholder="https://johndoe.com"
            defaultValue={initialProfile?.website as string}
            {...register("website", {
              maxLength: {
                value: 30,
                message:
                  "Website shouldn't be more than 30 character length, if long, use url-shortener",
              },
              minLength: {
                value: 4,
                message: "website should be more than 4 character",
              },
              pattern: {
                value: /https?:\/\//g,
                message: "start with http",
              },
            })}
            type="text"
            id="website"
            className="h-12 w-full rounded-md bg-gray-100 px-3 outline-none"
          />
          {errors.website && (
            <span className="font-mono text-red-500">
              😿 {errors.website.message}
            </span>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="rounded-full bg-accent py-2 px-6 font-medium text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
