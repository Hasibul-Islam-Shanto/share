import { Timestamp } from "firebase/firestore";

export type PostType = {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
  text: string;
  image: string;
  timestamp: Timestamp;
};
