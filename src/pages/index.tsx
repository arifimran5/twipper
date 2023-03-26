import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import AddPost from "@/components/feature/AddPost";
import PostList from "@/components/feature/PostList";
import Layout from "@/components/layout/layout";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: posts, isLoading } = api.post.getAllPosts.useQuery();

  posts;
  return (
    <Layout>
      <Head>
        <title>Twipper</title>
        <meta name="description" content="A twitter clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AddPost />
      <PostList posts={posts} isLoading={isLoading} />
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
