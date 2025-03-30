import { createContext, useEffect, useState } from "react";

export const ColorState = createContext();

const ColorProvider = ({ children }) => {
  const [isLight, setIsLight] = useState(
    localStorage.getItem("app_colors") === "light"
  );

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("app_colors", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("app_colors", "dark");
    }
  }, [isLight]);

  return (
    <ColorState.Provider value={{ isLight, setIsLight }}>
      {children}
    </ColorState.Provider>
  );
};

export default ColorProvider;
