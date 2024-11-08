/* eslint-disable @next/next/no-img-element */
"use client";

import { app } from "@/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

const Input = () => {
  const { data: session }: { data: any } = useSession();
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const imagePicker = useRef<HTMLInputElement>(null);
  const db = getFirestore(app);
  const addImageToPost = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + selectedFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile!!);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUploading(false);
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  const handleSubmit = async () => {
    setPostLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      uid: session?.user?.uid,
      name: session?.user?.name,
      username: session?.user?.username,
      email: session?.user?.email,
      profileImage: session?.user?.image,
      text,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    setPostLoading(false);
    setText("");
    setImageFileUrl(null);
    setSelectedFile(null);
    location.reload();
  };
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      {session && (
        <img
          src={session?.user?.image}
          alt="user-img"
          className="h-9 w-9 rounded-full cursor-pointer hover:brightness-95"
        />
      )}

      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 "
          placeholder="Whats happening"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl!!}
            alt="image"
            className={`w-full max-h-[250px] object-cover cursor-pointer
            ${imageFileUploading ? "animate-pulse" : ""}`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => {
              if (session) {
                imagePicker.current?.click();
              } else {
                signIn();
              }
            }}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imagePicker}
            onChange={addImageToPost}
          />
          <button
            disabled={
              text.trim() === "" ||
              postLoading ||
              imageFileUploading ||
              !session
            }
            onClick={handleSubmit}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default Input;
