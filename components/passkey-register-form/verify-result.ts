"use server";

import {
  PasskeyAuthenticator,
  addPasskeyAuthenticator,
} from "@/models/passkey-authenticator";
import { User } from "@/models/user";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";

export async function verifyResult(
  user: User,
  options: PublicKeyCredentialCreationOptionsJSON,
  result: RegistrationResponseJSON,
): Promise<PasskeyAuthenticator | undefined> {
  const { verified, registrationInfo } = await verifyRegistrationResponse({
    response: result,
    expectedChallenge: options.challenge,
    expectedOrigin: process.env.RP_ORIGIN ?? "empty rp origin",
    expectedRPID: process.env.RP_ID ?? "empty rp id",
  });

  if (!verified || registrationInfo === undefined) {
    return undefined;
  }

  return await addPasskeyAuthenticator({
    ...registrationInfo,
    userUuid: user.uuid,
  });
}
