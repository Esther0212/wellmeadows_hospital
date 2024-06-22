import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../components/supabase";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          const { user } = session;
          const staffNum = user?.user_metadata?.staff_num;

          if (staffNum) {
            const { data: userData, error: userError } = await supabase
              .from("Users")
              .select("first_name, last_name")
              .eq("staff_num", staffNum)
              .single();

            if (userError) {
              throw userError;
            }

            setUser({ ...user, ...userData }); // Merge user session data with fetched user data
          } else {
            setUser(user); // Update user state with session user data
          }
        } else {
          setUser(null); // No active session
        }
      } catch (error) {
        console.error("Error fetching session:", error.message);
        // Handle specific errors here, e.g., setUser(null), show error message, etc.
      }
    };

    fetchUserData(); // Fetch user data initially

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          fetchUserData(); // Fetch user data on sign-in or token refresh
        } else if (event === "SIGNED_OUT") {
          setUser(null); // Clear user state on sign-out
        }
      }
    );

    return () => {
      authListener.unsubscribe(); // Clean up listener
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
