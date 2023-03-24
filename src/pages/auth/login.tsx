import type { GetServerSideProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: sessionData } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (window) {
      if (sessionData?.user) void router.push("/");
    }
  }, [sessionData, router]);

  // const handleSignIn = async () => {
  //   const result = await signIn("github", {
  //     redirect: false,
  //   });

  //   if (!result.error && result) {
  //     router.push("/new");
  //   }
  // };

  return (
    <>
      <Head>
        <title>Login - Twipper</title>
        <meta name="description" content="Login page of twipper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Login Page</h1>
        <button
          className="rounded-full bg-gray-900/10 px-10 py-3 font-semibold text-black no-underline"
          onClick={
            sessionData ? () => void signOut() : () => void signIn("github")
          }
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
