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
                <img src="/blood_research.jpg" alt="Blood Research" className="mr-4" style={{ width: '25%', height: 'auto', float: 'left', marginRight: '1rem', marginBottom: '1rem' }} /> {/* First image */}
                <p className="text-lg">
                    In critical moments, access to blood can be a matter of life or death. Whether it's for emergency transfusions or routine medical procedures, the availability of blood is essential. However, navigating the complexities of blood donation and procurement can be daunting. Enter BLOOD+ – a revolutionary digital platform designed to bridge the gap between blood donors and recipients seamlessly.
                    <br />
                    <br />
                    BLOOD+ simplifies the blood donation process by allowing users to register as donors directly through the platform. Donors can create profiles, specify their blood type, and schedule appointments at nearby donation centers at their convenience. This streamlined approach encourages more individuals to become regular blood donors, thereby increasing the overall blood supply.
                    <br />
                    <br />
                    Beyond facilitating blood transactions, BLOOD+ is committed to raising awareness about the importance of blood donation. Through educational resources, testimonials, and interactive campaigns, the platform fosters a sense of community engagement and altruism. By demystifying misconceptions and addressing concerns, BLOOD+ aims to cultivate a culture of regular blood donation and volunteerism.
                </p>
            </div>
            <br />
            <br /> {/* Add a break line after the third paragraph */}

            <div style={{ textAlign: 'center' }}> {/* Centered image */}
                <img src="/remote_aread.jpg" alt="Remote Area" style={{ width: '70%', height: 'auto' }} /> {/* Second image */}
            </div>
                      
	              <br />
            <p className="text-lg">
                In a world where access to blood can mean the difference between life and death, BLOOD+ stands as a beacon of hope and solidarity. By leveraging the power of technology and community collaboration, BLOOD+ is revolutionizing the way we approach blood donation and distribution, saving lives one donation at a time. Join us in our mission to make blood accessible to all who need it, when they need it the most.
            </p>
        </div>
    );
};
