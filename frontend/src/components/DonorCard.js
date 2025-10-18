import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateTimeDelta } from "../util/datetime";
import {
  getDonationRequestByUserId,
  deleteDonationRequest,
  updateDonationRequest,
} from "../api/donation";
import { getUserById } from "../api/user";
import { showMessage } from "../redux/globalComponentSlice";
import Overlay from "../layouts/overlayContainer";

const menuButtonStyle =
  "card__action-btn p-1 w-8 h-8 cursor-pointer border rounded-full text-sm flex items-center justify-around";

const DonationCard = (props) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showUpdateMenu, setShowUpdateMenu] = useState(false);
+ const [shareMsg, setShareMsg] = useState('');
  // view card details
  const handleViewCard = async (cardId) => {
    try {
      const cardDetail = await getDonationRequestByUserId(cardId);
      // Handle the cardDetail appropriately
    } catch (error) {
      dispatch(showMessage({ heading: "Error", text: "Failed to fetch donation details" }));
    }
  };
+
+ const onShare = async () => {
+   try {
+     setShareMsg('');
+     const url = typeof window !== 'undefined' ? `${window.location.origin}/dashboard/donor-requests/${props.id}` : '';
+     const title = `Blood+ Request #${props.id}`;
+     const text = `Need ${props.quantity} ml of ${props.bloodType}. Can you help?`;
+     if (navigator.share) {
+       await navigator.share({ title, text, url });
+       setShareMsg('Thanks for sharing!');
+     } else {
+       try {
+         await navigator.clipboard.writeText(`${text} ${url}`);
+         setShareMsg('Link copied. Share it on your apps!');
+       } catch {}
+       const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
+       window.open(tw, '_blank', 'noopener');
+     }
+   } catch (e) {
+     setShareMsg(e?.message || 'Failed to share.');
+   }
+ };
  // delete card
  const handleDeleteCard = async (cardId) => {
    try {
      const response = await deleteDonationRequest(cardId);
      if (response.success) {
        setShowDeleteMenu(false);
        dispatch(
showMessage({ heading: "Success", text: `${response.message}` })
        );
      }
    } catch (error) {
      dispatch(showMessage({ heading: "Error", text: `${error}` }));
    }
  };

  // update card
  const handleUpdateCard = async (cardId) => {
    try {
      const response = await updateDonationRequest(cardId); // will update later to use same as create request form
      if (response.success) {
        dispatch(showMessage({ heading: "Success", text: "Request updated" }));
        setShowUpdateMenu(false);
      }
    } catch (error) {
      dispatch(showMessage({ heading: "Error", text: `${error.error || error.message}` }));
    }
  };

  const {
    id,
    bloodType,
    quantity,
    created_at,
    updated_at,
    userId,
    message,
    //location,
    //isFulfilled, // not yet
    //viewsCount, // not yet
    //urgent, // not yet
    editable = false,
  } = props;

  useEffect(() => {
    let isCancelled = false;
    const getUsername = async () => {
      try {
        const user = await getUserById(props.userId);
        if (!isCancelled) {
          setUsername(user.user.username);
          setUsernameError(null); // Clear any previous errors
        }
      } catch (err) {
        if (!isCancelled) {
          setUsernameError(err.message || 'Failed to fetch user');
          setUsername(null);
        }
      }
    };

    getUsername();
    return () => {
      isCancelled = true;
    };
  }, [props.userId]); // Runs whenever userId changes

  console.log("Username: ", username);

  return (
    <>
      <div className="card flex flex-col w-96 h-48 p-4 bg-white transition-all duration-100 hover:shadow-md hover:border-red-100 outline outline-transparent active:outline-red-100 rounded-lg">
        <div className="card__top flex items-center justify-between">
          <div
            className="top-left flex items-center gap-2 cursor-pointer group"
            onClick={() => handleViewCard(id)}
          >
            <div
              className="card__icon w-8 h-8 p-1 text-white text-center text-sm bg-red-600 border-l-4 border-l-red-800 transform -rotate-45"
              style={{ borderRadius: "1000px 0px 1000px 1000px" }}
            >
              <h2 className="icon-text">{bloodType}</h2>
            </div>
            <div className="leading-none">
              <small>
                {usernameError && (
                  <span className="text-red-500">User not found</span>
                )}
                <span className="my-1 px-1 rounded bg-slate-200">
                  {username ? username : `User ${userId}`}
                </span>{" "}
                is requesting
              </small>
              <h1 className="card__title text-2xl font-bold group-hover:text-red-400">
                {quantity}ml of {bloodType}
              </h1>
            </div>
          </div>
          <div className="top-right flex items-center gap-2">
            <button
              className={menuButtonStyle + " active:border-slate-300 hover:bg-slate-100 text-slate-600"}
              onClick={onShare}
              aria-label="Share request"
              title="Share"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="4" r="2" />
                <circle cx="20" cy="20" r="2" />
                <path d="M6 12l10-8M6 12l10 8" />
              </svg>
            </button>
            {editable && (
              <>
                <span
                  className={menuButtonStyle + " active:border-blue-300 hover:bg-blue-100 text-blue-400"}
                  onClick={() => setShowUpdateMenu(true)}
                >
                  E
                </span>
                <span
                  className={menuButtonStyle + " active:border-red-300 hover:bg-red-100 text-red-400"}
                  onClick={() => setShowDeleteMenu(true)}
                >
                  X
                </span>
              </>
            )}
          </div>
        </div>
        {shareMsg && <p className="text-xs text-gray-600 mt-1">{shareMsg}</p>}
        <div className="card__middle">
          {message && (
            <p className="card__text bg-slate-100 text-slate-500 truncate py-1 px-2 my-4 text-sm rounded">
              {message}
            </p>
          )}
        </div>
        <div className="card__foot flex items-end justify-between mt-auto border-t border-t-slate-100">
          <div className="bottom-left">
            <div className="card__location flex items-center gap-1">
              <span className="icon-location w-4 h-4 bg-blue-500 border-2 border-blue-200 rounded-full"></span>
              <p>Ghana</p>
            </div>
            <div className="card__date text-xs text-slate-400 flex gap-2">
              <p>Requested {calculateTimeDelta(created_at)}</p>
              {updated_at !== created_at && (
                <>
                  <p>•</p>
                  <p>Updated {calculateTimeDelta(updated_at)}</p>
                </>
              )}
            </div>
          </div>
          <small className="card__status bg-yellow-100 border border-yellow-300 text-yellow-600 px-2 rounded-full">
            pending
          </small>
        </div>
      </div>
    </>
  );
};

export default DonationCard;
