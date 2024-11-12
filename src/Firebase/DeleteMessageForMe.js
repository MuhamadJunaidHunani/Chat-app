import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

export const deleteMessageForMe = async (conversationId , messageId, userId) => {
  const messageRef = doc(db, "conversations", conversationId,  "messages", messageId);

  try {
    await updateDoc(messageRef, {
      deletedForUserIds: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};