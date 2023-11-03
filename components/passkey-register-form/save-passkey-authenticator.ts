"use server";

import {
  PasskeyAuthenticator,
  addPasskeyAuthenticator,
} from "@/models/passkey-authenticator";

export async function savePasskeyAuthenticator(
  passkeyAuthenticator: PasskeyAuthenticator,
) {
  await addPasskeyAuthenticator(passkeyAuthenticator);
}
