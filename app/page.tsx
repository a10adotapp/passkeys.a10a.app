import { SignInForm } from "@/components/sign-in-form";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export default async function Page() {
  const authenticationOptions = await generateAuthenticationOptions({
    rpID: "localhost",
  });

  return (
    <div className="container vstack gap-2">
      <h1>Sign In</h1>

      <SignInForm options={authenticationOptions} />

      <hr />

      <a href="/sign-up">Sign Up?</a>
    </div>
  );
}

export const runtime = "edge";
