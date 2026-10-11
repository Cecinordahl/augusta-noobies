import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, type User } from "../lib/firebase";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
