/* eslint-disable @next/next/no-img-element */
"use client";
import { modalState, postIdState } from "@/atom/modalAtom";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CommentModal = () => {
  const [isModalopen, setIsModalOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState<any>({});
  const [input, setInput] = useState<string>("");
  const { data: session }: { data: any } = useSession();
  const router = useRouter();

  const db = getFirestore(app);

  useEffect(() => {
    if (postId !== "") {
      const postRef = doc(db, "posts", postId);
      const fetchSinglePost = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
          setPost(snapshot.data());
          setIsModalOpen(true);
        } else {
          console.log("No such document");
        }
      });
      return () => fetchSinglePost();
    }
  }, [postId]);

  const postComment = async () => {
    await addDoc(collection(db, "posts", postId, "comment"), {
      name: session.user.name,
      username: session.user.username,
      userImage: session.user.image,
      comment: input,
      timestamp: serverTimestamp(),
    });
    setInput("");
    setIsModalOpen(false);
    router.push(`/posts/${postId}`);
  };
  return (
    <>
      <div>
        {isModalopen && (
          <Modal
            isOpen={isModalopen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}
            className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
          >
            <div className="p-4">
              <div className="border-b border-gray-200 py-2 px-1.5">
                <HiX
                  className="text-2xl text-gray-700 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
              <div className="p-2 flex items-center space-x-1 relative">
                <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
                <img
                  src={post?.profileImage}
                  alt="user-img"
                  className="h-11 w-11 rounded-full mr-4"
                />
                <h4 className="font-bold sm:text-[16px] text-[15px] hover:underline truncate">
                  {post?.name}
                </h4>
                <span className="text-sm sm:text-[15px] truncate">
                  @{post?.username}
                </span>
              </div>
              <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
                {post?.text}
              </p>
              <div className="flex p-3 space-x-3">
                <img
                  src={session.user.image}
                  alt="user-img"
                  className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
                />
                <div className="w-full divide-y divide-gray-200">
                  <div>
                    <textarea
                      className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500"
                      placeholder="Write a comment..."
                      rows={2}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end pt-2.5">
                    <button
                      className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                      disabled={input.trim() === ""}
                      onClick={postComment}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default CommentModal;
