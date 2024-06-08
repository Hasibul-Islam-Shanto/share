import { Timestamp } from "firebase/firestore";

export type PostType = {
  uid: string;
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
  text: string;
  image: string;
  timestamp: Timestamp;
};
