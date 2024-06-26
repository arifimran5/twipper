import { PostCard } from "@/components/feature/PostCard";
import { LoadingSpinner } from "@/components/general/Loading";
import Layout from "@/components/layout/layout";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EditPost from "@/components/feature/EditPost";

export default function PostPage({ id }: { id: string }) {
  const { data: session } = useSession();

  const router = useRouter();
  const { edit } = router.query;
  const [isEditing, setIsEditing] = useState(edit === "true");

  useEffect(() => {
    setIsEditing(false);
    if (edit === "true") {
      setIsEditing(true);
    }
  }, [edit]);

  const {
    data: post,
    isLoading,
    isError,
  } = api.post.getOnePost.useQuery({
    postId: id,
  });

  if (!session || !session.user) return null;
  if (isLoading) {
    return <LoadingSpinner width={40} height={40} />;
  }

  if (isError) {
    void router.push("/");
  }

  if (!post) {
    return <div>Post Not found</div>;
  }

  return (
    <>
      <Head>
        <title>Post by {session.user.username}</title>
        <meta name="description" content={`post of ${session.user.username}`} />
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
        {isEditing && <EditPost post={post} />}
        {!isEditing && (
          <main className="mx-auto mt-5 max-w-[36rem] space-y-5">
            <PostCard post={post} user={session.user} />
            <section>
              <h2 className="text-lg">Comments</h2>
            </section>
          </main>
        )}
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no username");

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session, id },
  };
};
