"use server";

import { getPasskeyAuthenticator } from "@/models/passkey-authenticator";
import { User, getUser } from "@/models/user";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/typescript-types";

export async function verifyResult(
  options: PublicKeyCredentialRequestOptionsJSON,
  result: AuthenticationResponseJSON,
): Promise<User | undefined> {
  const passkeyAuthenticator = await getPasskeyAuthenticator({
    credentialId: result.id,
  });

  if (passkeyAuthenticator === undefined) {
    return undefined;
  }

  const { verified } = await verifyAuthenticationResponse({
    response: result,
    expectedChallenge: options.challenge,
    expectedOrigin: process.env.RP_ORIGIN ?? "empty rp origin",
    expectedRPID: process.env.RP_ID ?? "empty rp id",
    authenticator: passkeyAuthenticator,
  });

  if (!verified) {
    return undefined;
  }

  return await getUser({ uuid: passkeyAuthenticator.userUuid });
}
