"use server";

import { addUser, getUser, newUser } from "@/models/user";
import { redirect } from "next/navigation";
import { FormState } from "./index";

export async function submit(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email");

  if (typeof email !== "string" || email === "") {
    return {
      error: "required field is empty: email.",
    };
  }

  const isUserRegistered = (await getUser({ email })) !== undefined;

  if (isUserRegistered) {
    return {
      error: "email already registered. try sign in.",
    };
  }

  await addUser(newUser(email));

  redirect(`/sign-up/${email}`);
}
