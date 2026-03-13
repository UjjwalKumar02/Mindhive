"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function LoginPage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async () => {
    const res = await fetch(`${HTTP_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      return;
    }

    router.push("/profile");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <label htmlFor="">Email</label>
      <input ref={emailRef} type="text" />
      <br />
      <label htmlFor="">Password</label>
      <input ref={passwordRef} type="text" />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
