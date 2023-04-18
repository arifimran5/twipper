import UpdateProfile from "@/components/profile/UpdateProfile";
import Layout from "@/components/layout/layout";
import type { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

export default function UserSettingPage({ username }: { username: string }) {
  const { data: session } = useSession();
  if (!session) return null;
  return (
    <Layout>
      <Head>
        <title>Settings - @{username}</title>
        <meta name="description" content={`Settings page of ${username}`} />
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
      <h1 className="mt-5 text-xl font-medium text-gray-400">
        Profile Settings
      </h1>

      <UpdateProfile session={session} />
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
