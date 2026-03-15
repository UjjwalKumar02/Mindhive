"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SignupPage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  let avatars = [
    "/images/avatar_1.jpg",
    "/images/avatar_2.jpg",
    "/images/avatar_3.jpg",
    "/images/avatar_4.jpg",
    "/images/avatar_5.jpg",
    "/images/avatar_6.webp",
    "/images/avatar_7.jpg",
  ];

  function pickAvatar(arr: string[]): string {
    let avatar = Math.floor(Math.random() * arr.length);
    if (!arr[avatar]) {
      return "TempAvatar";
    }
    return arr[avatar];
  }

  const handleSignup = async () => {
    if (
      nameRef.current?.value === "" ||
      emailRef.current?.value === "" ||
      passwordRef.current?.value === ""
    ) {
      alert("All fields are required!");
      return;
    }
    const res = await fetch(`${HTTP_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        avatar: pickAvatar(avatars),
      }),
    });

    if (!res.ok) {
      alert(res.statusText);
      return;
    }

    // try catch
    // check empty
    // clear

    router.push("/login");
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
      <label htmlFor="">Name</label>
      <input
        className="outline-none border border-black"
        ref={nameRef}
        type="text"
      />
      <br />
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
        onClick={handleSignup}
      >
        Signup
      </button>

      <Link href={"/login"} className="text-sky-500 font-medium mt-2">Login</Link>
    </div>
  );
}
