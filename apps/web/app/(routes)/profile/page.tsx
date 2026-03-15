"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../lib/apiFetch";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const [profileDetails, setProfileDetails] = useState<any>();
  const roomIdRef = useRef<HTMLInputElement | null>(null);

  const fetchProfile = async () => {
    const res = await apiFetch(`${HTTP_URL}/api/auth/me`, {
      method: "GET",
    });

    // if(!res.ok)

    const jsonData = await res.json();
    console.log(jsonData);
    setProfileDetails(jsonData);
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch(`${HTTP_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("token");

    router.push("/login");
  };

  const handleJoin = async () => {
    if (roomIdRef.current?.value === "") {
      alert("Room id is required!");
      return;
    }

    const roomId = roomIdRef.current?.value;
    if (roomId === "" || !roomId) {
      alert("Room id is required!");
      return;
    }

    const res = await apiFetch(`${HTTP_URL}/api/auth/get_token`, {
      method: "POST",
    });

    if (!res.ok) {
      alert(res.statusText);
      return;
    }

    const jsonData = await res.json();
    const token = jsonData.token;

    localStorage.setItem("token", token);

    router.push(`/room/${roomId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!profileDetails ? (
        <p>Error</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={profileDetails.avatar}
            width={1000}
            height={1000}
            alt="avatar"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
          />

          <p>{profileDetails.name}</p>
          <p>{profileDetails.email}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-black text-gray-100 font-medium tracking-tight px-6 py-2 rounded-xl mt-8"
      >
        Logout
      </button>

      <div className="mt-10 flex flex-col gap-4">
        <input
          className="outline-none border border-black"
          type="text"
          placeholder="Enter room id"
          ref={roomIdRef}
        />

        <button
          onClick={handleJoin}
          className="bg-sky-500 text-gray-100 font-medium tracking-tight px-6 py-2 rounded-xl mt-2 cursor-pointer"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
