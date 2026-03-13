"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import img1 from "../../public/avatar_1.jpg";
import img2 from "../../public/avatar_2.jpg";
import img3 from "../../public/avatar_3.jpg";
import img4 from "../../public/avatar_4.jpg";
import img5 from "../../public/avatar_5.jpg";
import img6 from "../../public/avatar_6.webp";
import img7 from "../../public/avatar_7.jpg";

export default function SignupPage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  let avatars = [
    img1.src,
    img2.src,
    img3.src,
    img4.src,
    img5.src,
    img6.src,
    img7.src,
  ];

  function pickAvatar(arr: string[]): string {
    let avatar = Math.floor(Math.random() * arr.length);
    if (!arr[avatar]) {
      return "TempAvatar";
    }
    return arr[avatar];
  }

  const handleSignup = async () => {
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
      <input ref={nameRef} type="text" />
      <br />
      <label htmlFor="">Email</label>
      <input ref={emailRef} type="text" />
      <br />
      <label htmlFor="">Password</label>
      <input ref={passwordRef} type="text" />
      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
