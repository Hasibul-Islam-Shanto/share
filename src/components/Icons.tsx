"use client";
import { modalState, postIdState } from "@/atom/modalAtom";
import { app } from "@/firebase";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import {
  HiHeart,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
} from "react-icons/hi";
import { useRecoilState } from "recoil";

type PropsType = {
  id: string;
  uid: string;
};
const Icons = ({ id, uid }: PropsType) => {
  const [likes, setLikes] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [isLiked, setisLiked] = useState<boolean>(false);
  const [isModalopen, setIsModalOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const { data: session }: { data: any } = useSession();
  const db = getFirestore(app);
  const likePost = async () => {
    if (session) {
      if (isLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
          username: session.user.username,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db, id]);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "comment"), (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [db, id]);

  useEffect(() => {
    setisLiked(
      likes.findIndex((like: any) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (session?.user?.uid === uid) {
        await deleteDoc(doc(db, "posts", id));
        window.location.reload();
      }
    }
  };
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <div className="flex items-center">
        <HiOutlineChat
          onClick={() => {
            if (!session) {
              signIn();
            } else {
              setIsModalOpen(!isModalopen);
              setPostId(id);
            }
          }}
          className="h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
        />
        {comments.length > 0 && (
          <span className="text-xs text-gray-600">{comments.length}</span>
        )}
      </div>
      <div className="flex items-center">
        {isLiked ? (
          <HiHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full  transition text-red-600 duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        ) : (
          <HiOutlineHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        )}
        {likes.length > 0 && (
          <span className={`text-xs ${isLiked && "text-red-600"}`}>
            {likes.length}
          </span>
        )}
      </div>
      {session?.user?.uid === uid && (
        <HiOutlineTrash
          onClick={deletePost}
          className="h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
        />
      )}
    </div>
  );
};

export default Icons;
