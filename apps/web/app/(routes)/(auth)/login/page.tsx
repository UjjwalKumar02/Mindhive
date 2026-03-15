"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function LoginPage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async () => {
    if (emailRef.current?.value === "" || passwordRef.current?.value === "") {
      alert("All fields are required!");
      return;
    }

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
      alert(res.statusText);
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
      <input
        className="outline-none border border-black"
        ref={emailRef}
        type="text"
      />
      <br />
      <label htmlFor="">Password</label>
      <input
        className="outline-none border border-black"
        ref={passwordRef}
        type="password"
      />
      <br />
      <button
        className="bg-sky-500 text-gray-100 font-medium tracking-tight px-6 py-2 rounded-xl mt-2 cursor-pointer"
        onClick={handleLogin}
      >
        Login
      </button>

      <Link href={"/signup"} className="text-sky-500 font-medium mt-2">
        Signup
      </Link>
    </div>
  );
}
