import type { GetServerSideProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Github } from "lucide-react";
import Image from "next/image";

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

      <section className="grid min-h-screen grid-cols-1 bg-slate-900 md:grid-cols-2">
        <div className="flex min-h-[50%] items-center justify-center bg-gradient-to-r from-slate-700 to-black/40 md:min-h-screen">
          <div>
            <Image
              src="/login-main-pc.png"
              alt="Main screen image of twipper profile"
              className="w-[400px] md:w-[500px]"
              width={500}
              height={605}
            />
          </div>
        </div>
        <section className="flex min-h-[50%] items-center justify-center md:min-h-screen">
          <div className="m-2 flex w-[30rem] flex-col items-center rounded-md p-4 text-center text-white md:p-6">
            <p className="border-b-2 border-gray-600 text-lg font-semibold text-gray-400">
              Start your Twipper journey 🚀
            </p>
            <button
              className="mt-4 flex w-max items-center gap-2 rounded-full border-2 border-slate-500 bg-gradient-to-br from-slate-700 to-slate-800 px-6 py-3 font-medium text-white no-underline transition-all duration-150 hover:bg-gradient-to-bl hover:from-slate-800 hover:to-slate-700"
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
