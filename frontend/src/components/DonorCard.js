import React from 'react';

const convertDateTime = (dateStr) => {
    const date = new Date(dateStr).toDateString();
    const time = new Date(dateStr).toLocaleTimeString();
    return `${date} at ${time}`;
}

const calculateDelta = (dateStr) => {

}

const sample = {
    "id": 2,
    "userId": 9,
    "bloodType": "B-",
    "quantity": 3,
    "isFulfilled": false,
    "requestingEntity": "User",
    "requestingEntityId": 9,
    "created_at": "2024-03-04T12:22:56.032Z",
    "updated_at": "2024-03-04T12:22:56.032Z",
    "location": "0101000020E610000000000000000028400000000000804040",
    "message": null,
    "urgent": false,
    "views_count": 0
}

const DonationCard = (props) => {

    const handleCardClick = (cardId) => {
        console.log("card clicked", cardId);
    }

    const {
        id,
        bloodType,
        quantity,
        created_at,
        updated_at,
        location,
        userId,
        message,
        isFulfilled, // not yet
        viewsCount, // not yet
        urgent, // not yet
    } = props;

    return (
        <div
            onClick={() => handleCardClick(id)}
            className="card group w-96 max-h-72 p-4 bg-white cursor-pointer transition-all duration-100 hover:shadow-md hover:border-red-100 outline outline-transparent active:outline-red-100 rounded-lg"
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
                <p className="card__text bg-slate-100 text-slate-500 truncate py-1 px-2 my-4 text-sm rounded">My apologies for misunderstanding your request. With Tailwind CSS alone, you can achieve transitions by using the transition utility classNamees provided by Tailwind.</p>
            </div>
            <div className="card__foot flex items-end justify-between">
                <div className="bottom-left">
                    <div className="card__location flex items-center mb-2 gap-1">
                        <span className="icon-location w-4 h-4 bg-blue-500 border-2 border-blue-200 rounded-full"></span>
                        <p>Ghana</p>
                    </div>
                    <div className="card__date text-xs text-slate-400 flex gap-2">
                        <p>Requested 3 days ago</p>
                        <p>•</p>
                        <p>Updated 3 days ago</p>
                    </div>
                </div>
                <small className="card__status bg-yellow-200 border border-yellow-400 text-yellow-600 px-3 py-1 rounded-full">pending</small>
            </div>
        </div>
    )
}

export default DonationCard;
