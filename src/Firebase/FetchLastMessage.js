import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";

export const FetchLastMessage = (conversationId, callback) => {
  const conversationDocRef = doc(db, "conversations", conversationId);

  const unsubscribe = onSnapshot(conversationDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const lastMessage = docSnap.data();
      callback(lastMessage); 
    } else {
      console.log("No such conversation document!");
      callback(null);
    }
  }, (error) => {
    console.error("Error fetching last message:", error);
    throw error;
  });

  return unsubscribe;
};
