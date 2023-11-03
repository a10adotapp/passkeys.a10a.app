import { PassKeyRegisterForm } from "@/components/passkey-register-form";
import { getUser } from "@/models/user";

export default async function Page({
  params,
}: {
  params: {
    email: string;
  };
}) {
  const email = decodeURIComponent(params.email);
  const user = await getUser({ email });

  if (user === undefined) {
    return (
      <div className="container vstack gap-2">
        <div className="error">{`user not found with email: ${email}`}</div>

        <a href="/sign-up">Back</a>
      </div>
    );
  }

  return (
    <div className="container vstack gap-2">
      <h1>{user.email}</h1>

      <PassKeyRegisterForm user={user} />

      <hr />

      <a href="/">Sign In?</a>
    </div>
  );
}
