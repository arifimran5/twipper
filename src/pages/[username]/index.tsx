import PostList from "@/components/feature/PostList";
import Layout from "@/components/layout/layout";
import { LikedPostList, SavedPostList } from "@/components/profile/FilterPost";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const UsernamePage = ({ username }: { username: string }) => {
  const { data: posts, isLoading } = api.profile.getPostsByUser.useQuery(
    {
      username,
    },
    { refetchOnMount: true }
  );

  const [postListFilter, setPostListFilter] = useState("my");

  const { data: session } = useSession();
  if (!session) return null;

  const isCurrentUser = session.user.username === username;
  const showMyPostList = postListFilter === "my";
  const showLikedPostList = postListFilter === "liked";
  const showSavedPostList = postListFilter === "saved";

  return (
    <>
      <Head>
        <title>@{username}</title>
        <meta name="description" content={`Profile of ${username}`} />
        <link
          rel="shortcut icon"
          sizes="16x16"
          type="image/svg"
          href="/16x16.svg"
        />
        <link
          rel="shortcut icon"
          sizes="32x32"
          type="image/svg"
          href="/32x32.svg"
        />
      </Head>
      <Layout>
        <main className="mx-auto max-w-[36rem]">
          <Profile username={username} />
          {isCurrentUser ? (
            <div className="space-x-6">
              <button
                onClick={() => setPostListFilter("my")}
                className={`mt-5 font-medium text-gray-500 ${
                  showMyPostList ? "border-b-2 border-accent" : ""
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setPostListFilter("liked")}
                className={`mt-5 font-medium text-gray-500 ${
                  showLikedPostList ? "border-b-2 border-accent" : ""
                }`}
              >
                Liked
              </button>
              <button
                onClick={() => setPostListFilter("saved")}
                className={`mt-5 font-medium text-gray-500 ${
                  showSavedPostList ? "border-b-2 border-accent" : ""
                }`}
              >
                Saved
              </button>
            </div>
          ) : (
            ""
          )}

          {showMyPostList ? (
            <PostList posts={posts} isLoading={isLoading} />
          ) : null}
          {showLikedPostList ? <LikedPostList username={username} /> : null}
          {showSavedPostList ? <SavedPostList username={username} /> : null}
        </main>
      </Layout>
    </>
  );
};

const Profile = ({ username }: { username: string }) => {
  const {
    data: user,
    error,
    isLoading,
  } = api.profile.getProfileByUsername.useQuery({
    username: username,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[36rem]">
        <section className="mt-8 rounded-md bg-gray-300 p-5">
          <div className="h-[100px] w-[100px] rounded-full bg-gray-200"></div>
          <h1 className="mt-2 h-2 w-[20%] rounded-xl bg-gray-200"></h1>
          <p className="mt-4 h-2 rounded-xl bg-gray-200"></p>
          <p className="mt-2 h-2 w-[70%] rounded-xl bg-gray-200"></p>
        </section>
      </div>
    );
  }

  const websiteArr = user.website?.split("//");

  return (
    <section className="mt-8 rounded-2xl bg-gradient-to-t from-primary_dark via-slate-900 to-slate-800 p-5">
      <div className="w-max rounded-full bg-accent p-[2px]">
        <Image
          width={100}
          height={100}
          className="rounded-full"
          src={user.image as string}
          alt={`${user.name ?? user.username} image`}
        />
      </div>

      <h1 className="mt-2 text-2xl font-semibold text-white">
        {user.name ?? user.username}
      </h1>

      <div className=" mt-1 flex items-center gap-8">
        <h2 className="font-medium text-gray-400">@{user.username}</h2>
        {user.website ? (
          <a href={user.website}>
            <span className="text-blue-400 underline underline-offset-1">
              {!websiteArr && user.website}
              {websiteArr && websiteArr[1]}
            </span>
          </a>
        ) : null}
      </div>
      {user.bio ? <p className="mt-1 text-gray-200">{user.bio}</p> : null}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const slug = context.params?.username;
  if (typeof slug !== "string") throw new Error("no username");
  const username = slug.substring(1);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session, username },
  };
};

export default UsernamePage;
