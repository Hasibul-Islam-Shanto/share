/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiHome } from "react-icons/hi";

const Sidebar = () => {
  const { data: session }: { data: any } = useSession();
  console.log("🚀 ~ Sidebar ~ session:", session);

  return (
    <>
      <div className="flex flex-col p-3 justify-between h-screen">
        <div className="flex flex-col gap-4 ">
          <Link href="/">
            <Image
              alt="Share"
              src="/logo.png"
              height={64}
              width={64}
              className="hover:bg-slate-100 rounded-full transition-all duration-200"
            />
          </Link>
          <Link
            href={"/"}
            className="flex items-center justify-start gap-x-2 p-3 hover:bg-slate-100 rounded-full transition-all duration-200"
          >
            <HiHome className="h-7 w-7" />
            <span className="font-bold text-lg  hidden xl:inline">Home</span>
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-blue-400 text-white rounded-full  hover:brightness-95 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline font-semibold"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-400 text-white rounded-full  hover:brightness-95 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline font-semibold"
            >
              Sign In
            </button>
          )}
        </div>

        {session && (
          <div className="flex items-center justify-start gap-2 px-5 py-3 rounded-full hover:bg-gray-100 cursor-pointer">
            <img
              src={session?.user.image}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col items-start justify-start">
              <span className="text-lg text-gray-800 font-semibold">
                {session.user?.name}
              </span>
              <span className="text-md text-gray-600 font-semibold">
                @{session.user!!.username}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
