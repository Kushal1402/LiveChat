import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

const EmojiPicker = ({ onSelect, onClose }) => {
  const [Picker, setPicker] = useState(null);
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState("light");

  console.log(resolvedTheme);

  useEffect(() => {
    const getResolvedTheme = () => {
      if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return theme;
    };

    setResolvedTheme(getResolvedTheme());

    // Optional: Listen for system changes when in system mode
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setResolvedTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  React.useEffect(() => {
    (async () => {
      const mod = await import("@emoji-mart/react");
      setPicker(() => mod.default);
    })();
  }, []);

  if (!Picker) return null;


  return (
    // <div className="bg-white dark:bg-gray-800  rounded-lg shadow-lg border dark:border-gray-700">
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          onSelect(emoji);
          // onClose();
        }}
        onClickOutside={onClose}
        theme={resolvedTheme}
        previewPosition="none"
        skinTonePosition="none"
      />
    // </div>
  );
};

export default EmojiPicker;