// PositionContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../components/supabase.js";
import { useUser } from "./userContext.jsx";

export const PositionContext = createContext();

export const PositionProvider = ({ children }) => {
  const { user } = useUser();
  const [positionNum, setPositionNum] = useState(null);

  useEffect(() => {
    const fetchPositionData = async () => {
      if (user && user.staff_num) {
        try {
          const { data, error } = await supabase
            .from("position")
            .select("position_num")
            .eq("staff_num", user.staff_num)
            .single();

          if (error) {
            throw error;
          }

          setPositionNum(data.position_num);
          console.log("Position number set to:", data.position_num);
        } catch (error) {
          console.error("Error fetching position data:", error.message);
        }
      }
    };

    fetchPositionData();
  }, [user]);

  return (
    <PositionContext.Provider value={{ positionNum, setPositionNum }}>
      {children}
    </PositionContext.Provider>
  );
};

// Custom hook for accessing the context
export const usePosition = () => useContext(PositionContext);
