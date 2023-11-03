"use client";

import { startAuthentication } from "@simplewebauthn/browser";
import { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/typescript-types";
import { useEffect, useRef } from "react";
import { generateOptions } from "./generate-options";
import { verifyResult } from "./verify-result";

export function SignInForm({
  options,
}: {
  options: PublicKeyCredentialRequestOptionsJSON;
}) {
  const emailFieldRef = useRef<HTMLInputElement>(null);
  const hasAuthenticationStartedRef = useRef(false);

  useEffect(() => {
    if (!hasAuthenticationStartedRef.current) {
      (async () => {
        const options = await generateOptions();

        startAuthentication(options, true)
          .then(async (result) => {
            const user = await verifyResult(options, result);

            if (user === undefined) {
              throw new Error("verification failed");
            }

            if (emailFieldRef.current !== null) {
              emailFieldRef.current.value = user.email;
            }

            alert(`Sign-In succeeded!\nHello ${user.email}`);
          })
          .catch((err) => {
            alert(JSON.stringify({ error: err }, null, " "));
          });
      })();

      return () => {
        hasAuthenticationStartedRef.current = true;
      };
    }
  }, [options]);

  return (
    <div className="vstack">
      <label htmlFor="email">Email</label>

      <input
        ref={emailFieldRef}
        id="email"
        name="email"
        autoComplete="username webauthn"
      />
    </div>
  );
}
