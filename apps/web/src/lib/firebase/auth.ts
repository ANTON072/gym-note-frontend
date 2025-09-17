import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./config";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};