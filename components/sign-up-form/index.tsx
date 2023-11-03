"use client";

import { useFormState } from "react-dom";
import { submit } from "./submit";

export type FormState = {
  error?: string;
};

export function SignUpForm() {
  const [formState, formAction] = useFormState(submit, {});

  return (
    <form action={formAction}>
      <div className="vstack gap-1">
        <div className="vstack">
          <label htmlFor="email">Email</label>

          <input id="email" name="email" autoComplete="username" />
        </div>

        {formState.error ? (
          <div className="error">{formState.error}</div>
        ) : null}

        <button>Sign Up</button>
      </div>
    </form>
  );
}
