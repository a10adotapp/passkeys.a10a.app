"use server";

import { listPasskeyAuthenticator } from "@/models/passkey-authenticator";
import { User } from "@/models/user";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";

export async function generateOptions(
  user: User,
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const passkeyAuthenticators = await listPasskeyAuthenticator({
    userUuid: user.uuid,
  });

  return await generateRegistrationOptions({
    rpName: process.env.RP_NAME ?? "empty rp name",
    rpID: process.env.RP_ID ?? "empty rp id",
    userID: user.uuid,
    userName: user.email,
    excludeCredentials: passkeyAuthenticators.map((passkeyAuthenticator) => ({
      id: passkeyAuthenticator.credentialID,
      type: "public-key",
    })),
  });
}
