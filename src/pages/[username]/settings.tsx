import Layout from "@/components/layout/layout";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

export default function UserSettingPage({ username }: { username: string }) {
  return (
    <Layout>
      <Head>
        <title>Settings - @{username}</title>
        <meta name="description" content={`Settings page of ${username}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mt-5 text-xl font-medium text-gray-400">
        Profile Settings
      </h1>

      <div>
        <form className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="full_name">Name</label>
            <input
              type="text"
              id="full_name"
              className="h-12 w-full rounded-md bg-gray-100 px-2 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              id="bio"
              className="h-12 w-full rounded-md bg-gray-100 px-2 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              className="h-12 w-full rounded-md bg-gray-100 px-2 outline-none"
            />
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
    </Layout>
  );
}

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
