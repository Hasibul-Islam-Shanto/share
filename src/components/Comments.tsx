"use client";
import { app } from "@/firebase";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { comment } from "postcss";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";

const Comments = ({ id }: { id: string }) => {
  const [comments, setComments] = useState<any>([]);
  const db = getFirestore(app);
  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "comment"), (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [db, id]);
  return (
    <div>
      {comments.map((comment: any) => (
        <Comment
          key={comment.id}
          comment={comment.data()}
          commentId={comment.id}
          originalPostId={id}
        />
      ))}
    </div>
  );
};

export default Comments;
