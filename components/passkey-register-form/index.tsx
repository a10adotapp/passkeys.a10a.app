"use client";

import { User } from "@/models/user";
import { startRegistration } from "@simplewebauthn/browser";
import { useCallback, useState } from "react";
import { generateOptions } from "./generate-options";
import { verifyResult } from "./verify-result";

export function PassKeyRegisterForm({ user }: { user: User }) {
  const [error, setError] = useState<string>();

  const click = useCallback(async () => {
    const options = await generateOptions(user);

    const result = await startRegistration(options);

    const passkeyAuthenticator = await verifyResult(user, options, result);

    if (passkeyAuthenticator === undefined) {
      setError("verification failed");
    }

    alert("Register succeeded!");
  }, [user]);

  return (
    <div className="vstack gap-1">
      {error ? <div className="error">{error}</div> : null}

      <button onClick={click}>Register Passkey</button>
    </div>
  );
}
