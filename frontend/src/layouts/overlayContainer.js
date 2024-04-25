import React, { useRef, useEffect } from "react";
import { menuButtonStyle } from "../styles";


const Overlay = ({ showWindow, children }) => {

    const ref = useRef(null);

    const handleClickAway = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            showWindow(false);
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('mousedown', handleClickAway);
        return () => {
            document.removeEventListener('mousedown', handleClickAway);
        }
    }, []);

    return (
        <div
            id="overlay-container"
            style={{ backgroundColor: "rgb(0 0 0 / 68%)" }}
            className="absolute top-0 right-0 z-50 w-full h-full top-0 flex flex-col pt-[8%] items-center"
        >
            <div ref={ref}
                className="overlay-window bg-white rounded-lg shadow-md overflow-hidden relative"
            >
                <button
                    onClick={() => showWindow(false)}
                    className={menuButtonStyle + " float-right m-4 right-4 top-4 active:border-slate-300 hover:bg-slate-100 text-slate-400"}
                >X</button>
                {children}
            </div>
        </div>
    )
}

export default Overlay;
