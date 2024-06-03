import { Link } from "react-router-dom";

const ProfileCard = (props) => {
    const { profileImage, name, contact, about } = props;

    return (
        <Link to={contact} target="_blank" rel="noreferrer">
            <div className="w-full md:min-w-[300px] text-center profile-card bg-white rounded-lg hover:shadow-lg border border-gray-200 p-4">
                <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h2 className=" text-xl font-bold mb-2">{name}</h2>
                <span className=" inline-block bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {about}
                </span>
            </div>
        </Link>
    );
};

export default ProfileCard;