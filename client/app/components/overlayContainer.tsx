import React from "react";
import DonationRequestForm from "./donationRequestForm";

const Overlay: React.FC<{ closeOverlay: Function }> = ({ closeOverlay }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 overflow-y-auto"
        >
            <button
                onClick={() => closeOverlay(false)}
                className="absolute top-4 right-4 bg-white flex items-center justify-center w-10 h-10 rounded-full shadow"
                aria-label="Close overlay"
            >
                X
            </button>
            <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6">
                <DonationRequestForm />
            </div>
        </div>
    )
}

export default Overlay;
