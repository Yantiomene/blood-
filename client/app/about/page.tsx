import React from 'react';

export default function AboutPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">About Blood+</h1>

            <p className="text-lg">
                BLOOD+: Your One-Stop Digital Solution for Blood Access and Donation.
            </p>
            <br /> {/* Add a break line after the first paragraph */}

            <div className="flex"> {/* Added a flex container */}
                <img src="/blood_research.jpg" alt="Blood Research" className="mr-4" style={{ width: '25%', height: 'auto', float: 'left', marginRight: '1rem', marginBottom: '1rem' }} /> {/* Image added with a quarter of the size */}
                <p className="text-lg">
                    BLOOD+ simplifies the blood donation process by allowing users to register as donors directly through the platform. Donors can create profiles, specify their blood type, and schedule appointments at nearby donation centers at their convenience. This streamlined approach encourages more individuals to become regular blood donors, thereby increasing the overall blood supply.

                    <br />

		    <br />

                    Beyond facilitating blood transactions, BLOOD+ is committed to raising awareness about the importance of blood donation. Through educational resources, testimonials, and interactive campaigns, the platform fosters a sense of community engagement and altruism. By demystifying misconceptions and addressing concerns, BLOOD+ aims to cultivate a culture of regular blood donation and volunteerism.

                </p>
            </div>
            <br /> 
	    <br />
	    {/* Add a break line after the third paragraph */}
        </div>
    );
};

