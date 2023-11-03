import { SignUpForm } from "@/components/sign-up-form";

export default async function Page() {
  return (
    <div className="container vstack gap-2">
      <h1>Sign Up</h1>

      <SignUpForm />

      <hr />

      <a href="/">Sign In?</a>
    </div>
  );
}
