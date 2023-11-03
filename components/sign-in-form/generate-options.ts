"use server";

import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";

export async function generateOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  return await generateAuthenticationOptions({
    rpID: process.env.RP_ID ?? "empty rp id",
  });
}
