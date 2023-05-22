import type { GetServerSideProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Github } from "lucide-react";

const LoginPage = () => {
  const { data: sessionData } = useSession();

  // const router = useRouter();

  // useEffect(() => {
  //   if (window) {
  //     if (sessionData?.user) void router.push("/");
  //   }
  // }, [sessionData, router]);

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

      <section className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="rounded-md bg-white p-6 sm:w-[30rem]">
          <h1 className="text-3xl font-bold">Welcome 🧁</h1>
          <p>Start your journey of `disney clone of twitter` 👉 Twipper</p>
          <button
            className="mt-4 flex items-center gap-2 rounded-full border-2 border-slate-500 bg-gradient-to-br from-slate-700 to-slate-800 px-6 py-3 font-medium text-white no-underline"
            onClick={
              sessionData ? () => void signOut() : () => void signIn("github")
            }
          >
            <span>
              <Github className="w-5" />
            </span>{" "}
            {sessionData ? "Sign out" : "Sign in with Github"}
          </button>
        </div>
      </section>
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
