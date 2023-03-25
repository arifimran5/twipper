import type { GetServerSideProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Github } from "lucide-react";

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
      <main className="flex min-h-screen justify-between">
        <div className="hidden w-[40%] shrink-0 bg-accent bg-gradient-to-br from-red-100 to-accent sm:block"></div>
        <section className="flex w-full bg-slate-900 px-4">
          <div className="self-center rounded-md bg-white p-6 sm:-ml-24 sm:w-[30rem]">
            <h1 className="text-3xl font-bold">Welcome 🧁</h1>
            <p>Get started with your journey with Twipper</p>
            <button
              className="mt-4 flex items-center gap-2 rounded-full bg-primary_dark px-6 py-3 font-medium text-white no-underline"
              onClick={
                sessionData ? () => void signOut() : () => void signIn("github")
              }
            >
              <span>
                <Github className="w-5" />
              </span>{" "}
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </div>
        </section>
      </main>
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
