import { signIn, signOut, useSession } from "next-auth/react";
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

  return (
    <>
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
