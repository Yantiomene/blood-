import React from "react";
import DonationRequestForm from "../components/donationRequestForm";

const Overlay = ({ closeOverlay }) => {
    return (
        <div
            style={{ backgroundColor: "rgb(0 0 0 / 68%)" }}
            className="absolute z-50 w-full h-full top-0 flex flex-col pt-[8%] items-center"
        >
            <button
                onClick={() => closeOverlay(false)}
                className="p-2 my-4 bg-white flex items-center justify-center w-10 h-10 rounded-full"
            >X
            </button>
            <DonationRequestForm />
        </div>
    )
}

export default Overlay;
