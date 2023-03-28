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
