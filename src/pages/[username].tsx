import PostList from "@/components/feature/PostList";
import Layout from "@/components/layout/layout";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

const UsernamePage = ({ username }: { username: string }) => {
  const { data: posts, isLoading } = api.profile.getPostsByUser.useQuery({
    username,
  });

  return (
    <>
      <Head>
        <title>@{username}</title>
        <meta name="description" content={`Profile of ${username}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="mx-auto max-w-[36rem]">
          <Profile username={username} />
          <h3 className="mt-8 text-xl font-semibold">My Posts</h3>
          <PostList posts={posts} isLoading={isLoading} />
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
  return (
    <section className="mt-8 rounded-2xl bg-primary_dark p-5">
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
      {user.name && (
        <h2 className="mt-1 font-medium text-gray-400">@{user.username}</h2>
      )}
      <p className="mt-1 text-gray-200">bio goes here..</p>
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
