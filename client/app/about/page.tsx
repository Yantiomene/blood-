import React from 'react';

export default function AboutPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">About Blood+</h1>

            <p className="text-lg">
                BLOOD+: Your One-Stop Digital Solution for Blood Access and Donation.
            </p>
            <br /> {/* Add a break line after the first paragraph */}

            <p className="text-lg">
                BLOOD+ simplifies the blood donation process by allowing users to register as donors directly through the platform. Donors can create profiles, specify their blood type, and schedule appointments at nearby donation centers at their convenience. This streamlined approach encourages more individuals to become regular blood donors, thereby increasing the overall blood supply.
            </p>
            <br /> {/* Add a break line after the second paragraph */}

            <div className="flex"> {/* Added a flex container */}
                <img src="/blood_research.jpg" alt="Blood Research" className="mr-4" style={{ width: '35%', height: 'auto' }} /> {/* Image added with a quarter of the size */}
                <p className="text-lg">
                    In critical moments, access to blood can be a matter of life or death. Whether it's for emergency transfusions or routine medical procedures, the availability of blood is essential. However, navigating the complexities of blood donation and procurement can be daunting. Enter BLOOD+, a revolutionary digital platform designed to bridge the gap between blood donors and recipients seamlessly.
                    {/* will put information about app, developers, etc... */}
                </p>
            </div>
        </div>
    );
};

