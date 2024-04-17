import { calculateTimeDelta } from "../util/datetime";
import { getDonationRequestByUserId, deleteDonationRequest } from "../api/donation";

const DonationCard = (props) => {

    const handleCardClick = async (cardId) => {
        const cardDetail = await getDonationRequestByUserId(cardId);
        console.log("card clicked", cardDetail);
    }

    const handleDeleteCard = async (cardId) => {
        const response = await deleteDonationRequest(cardId);
        console.log("card deleted", response);
    }

    const {
        id,
        bloodType,
        quantity,
        created_at,
        updated_at,
        userId,
        message,
        location,
        isFulfilled, // not yet
        viewsCount, // not yet
        urgent, // not yet
    } = props;

    return (
        <div
            onClick={() => handleCardClick(id)}
            className="card group flex flex-col w-96 h-48 p-4 bg-white cursor-pointer transition-all duration-100 hover:shadow-md hover:border-red-100 outline outline-transparent active:outline-red-100 rounded-lg"
        >
            <div className="card__top flex items-center justify-between">
                <div className="top-left flex items-center gap-2">
                    <div className="card__profile-icon w-10 h-10 bg-red-300 rounded-full"></div>
                    <div className='leading-none'>
                        <small>Esmond, {userId} is requesting</small>
                        <h1 className="card__title text-3xl font-bold">{quantity}ml of {bloodType}</h1>
                    </div>
                </div>
                <div
                    className="card__icon w-8 h-8 p-1 text-white text-center text-xs bg-red-600 border-l-4 border-l-red-800 transform -rotate-45 -translate-y-8 transition duration-500 group-hover:-translate-y-2"
                    style={{ borderRadius: "1000px 0px 1000px 1000px" }}
                >
                    <h2 className="icon-text">{bloodType}</h2>
                </div>
            </div>
            <div className="card__middle">
                {
                    message &&
                    <p className="card__text bg-slate-100 text-slate-500 truncate py-1 px-2 my-4 text-sm rounded">
                        {message}
                    </p>
                }
            </div>
            <div className="card__foot flex items-end justify-between mt-auto border-t border-t-slate-100">
                <div className="bottom-left">
                    <div className="card__location flex items-center gap-1">
                        <span className="icon-location w-4 h-4 bg-blue-500 border-2 border-blue-200 rounded-full"></span>
                        <p>Ghana</p>
                    </div>
                    <div className="card__date text-xs text-slate-400 flex gap-2">
                        <p>Requested {calculateTimeDelta(created_at)}</p>
                        {
                            updated_at !== created_at &&
                            <>
                                <p>•</p>
                                <p>Updated {calculateTimeDelta(updated_at)}</p>
                            </>
                        }
                    </div>
                </div>
                <small className="card__status bg-yellow-200 border border-yellow-400 text-yellow-600 px-3 py-1 rounded-full">pending</small>
            </div>
        </div>
    )
}

export default DonationCard;
