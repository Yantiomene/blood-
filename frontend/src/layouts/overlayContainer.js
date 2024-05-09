/* eslint-disable */
import React, { useRef, useEffect } from "react";
import { menuButtonStyle } from "../styles";

const Overlay = ({ showWindow, children }) => {
  const ref = useRef(null);

  const closeWindow = () => {
    document.body.style.overflow = "auto";
    showWindow(false);
  };

  const handleClickAway = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closeWindow();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, []);

  return (
    <div
      id="overlay-container"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.33)" }}
      className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center"
    >
      <div
        ref={ref}
        className="overlay-window bg-white rounded-lg shadow-md overflow-hidden"
      >
        <button
          onClick={closeWindow}
          className={
            menuButtonStyle +
            " float-right m-4 right-4 top-4 active:border-slate-300 hover:bg-slate-100 text-slate-400"
          }
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
/* eslint-enable */
