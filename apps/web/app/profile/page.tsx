"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/apiFetch";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;
  const router = useRouter();
  const [profileDetails, setProfileDetails] = useState<any>();

  const fetchProfile = async () => {
    const res = await apiFetch(`${HTTP_URL}/api/auth/me`, {
      method: "GET",
    });

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

    router.push("/login");
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
    </div>
  );
}
