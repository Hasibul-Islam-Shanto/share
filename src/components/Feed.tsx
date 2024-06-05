import { app } from "@/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import React from "react";
import { PostType } from "../../types/post";
import Post from "./Post";

const Feed = async () => {
  const data: PostType[] = [];
  const db = getFirestore(app);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as PostType);
  });

  return (
    <>
      {data.map((post) => (
        <div key={post.timestamp.seconds}>
          <Post post={post} id={post.id} />
        </div>
      ))}
    </>
  );
};

export default Feed;
