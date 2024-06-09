import Comments from "@/components/Comments";
import Post from "@/components/Post";
import { app } from "@/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { HiArrowLeft } from "react-icons/hi";

const PostsPage = async ({ params }: { params: { id: string } }) => {
  console.log("🚀 ~ PostsPage ~ params:", params);
  let data: any = {};
  const db = getFirestore(app);
  const post = await getDoc(doc(db, "posts", params.id));
  data = { ...post.data(), id: post.id };

  return (
    <div className="mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link href={"/"} className="hover:bg-gray-100 rounded-full p-2">
          <HiArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>
      <Post post={data} id={post.id} />
      <Comments id={params.id} />
    </div>
  );
};

export default PostsPage;
