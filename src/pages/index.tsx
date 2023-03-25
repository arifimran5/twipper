import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getSession, useSession } from "next-auth/react";

// import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AddPost from "@/components/feature/AddPost";
import PostList from "@/components/feature/PostList";
import Layout from "@/components/layout/layout";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (window) {
      if (!sessionData) void router.push("/auth/login");
    }
  }, [sessionData, router]);

  return (
    <Layout>
      <Head>
        <title>Twipper</title>
        <meta name="description" content="A twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AddPost />
      <PostList />
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
