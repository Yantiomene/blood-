import React from 'react';
import { Link } from 'react-router-dom';
import { bloodDonor } from "../assets";
import { REGISTERROUTE } from '../api';
import ProfileCard from '../components/profileCard';
import TestimonialCard from '../components/testimonialCard';

const Home = () => {
    return (
      <>
            {/* Hero Section */}
            <section className="relative h-screen">
                <div className="absolute inset-0">
                    <img src={bloodDonor} alt="Blood Donor" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-red-900 opacity-50"></div>
                </div>
                <div className="p-10 absolute inset-0 flex flex-col justify-center items-center text-white">
                    <h1 className="text-7xl font-bold mb-4">Donate Blood, Save Lives</h1>
                    <p className="text-lg text-center mb-8">Join us in our mission to ensure that blood is available to those who need it.</p>
                    <Link to={REGISTERROUTE} className="bg-white text-red-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-red-700 hover:text-white transition duration-300 ease-in-out">Donate Now</Link>
                </div>
            </section>

          <div className="py-10 px-[10%]">

              {/* About Section */}
              <section className="py-10 my-6 flex flex-col md:flex-row gap-10 items-center">
                  <div className="container mx-auto">
                      <h2 className="text-3xl font-bold mb-4 ">About Us</h2>
                      <p className="text-lg ">
                        Blood+ is a digital resource for blood access and donations. We are a team of volunteers who are committed to ensuring that blood is available to those who need it.
                      </p>
                  </div>
                  <div 
                  className="md:shrink-0 w-[500px] h-[300px] rounded-md bg-cover bg-center bg-no-repeat shadow-lg"
                  style={{backgroundImage: `url('/images/blood_research.jpg')`}}
                  ></div>
              </section>

              {/* Call-to-Action Section */}
              <section className="bg-gray-100 p-10 my-6 text-center bg-gray-200 rounded-md">
                  <div className="container mx-auto">
                      <h2 className="text-3xl font-bold mb-4 ">Get Involved</h2>
                      <p className="text-lg mb-8">Your donation can make a difference. Join us in our mission to save lives.</p>
                      <div className="">
                          <Link to={REGISTERROUTE} className="bg-red-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out">Donate Now</Link>
                      </div>
                  </div>
              </section>

              {/* Statistics Section */}
              <section className="py-10 my-6 flex flex-col md:flex-row gap-10 items-center">
                  <div 
                    className="shrink-0 w-[500px] h-[300px] rounded-md bg-cover bg-center bg-no-repeat shadow-lg"
                    style={{backgroundImage: `url('/images/remote_area.jpg')`}}
                  ></div>
                  <div className="container mx-auto">
                      <h2 className="text-3xl font-bold mb-4 ">Our Impact</h2>
                      <p className='text-lg mb-8'>
                      Through our relentless efforts and the support of our generous donors, we have made a significant impact on countless lives. Our blood donation drives have provided critical blood supplies to hospitals, saving lives in emergencies, surgeries, and medical treatments. With each donation, we bring hope and healing to those in need, making a tangible difference in our communities.
                        </p>
                  </div>
              </section>

              <section className="bg-gray-100 py-10">
    <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
                name="Adetola Ogunleye"
                image="/images/young-african-lady.jpg"
                testimonial="I had a great experience donating blood with Blood+. The process was smooth and the staff were very friendly and helpful. Knowing that my donation could save lives gave me a sense of fulfillment."
            />
            <TestimonialCard
                name="Kwame Amoah"
                image="/images/young-african-kid.jpg"
                testimonial="I've been a regular blood donor with Blood+ for years now, and I can confidently say that they are one of the best organizations I've ever encountered. Their professionalism and commitment to their cause are truly commendable."
            />
            <TestimonialCard
                name="Fatoumata Diop"
                image="/images/smile-african-lady.jpg"
                testimonial="Blood+ is doing incredible work in ensuring blood accessibility for everyone. As a recipient of donated blood myself, I'm grateful for their efforts and dedication to saving lives."
            />
        </div>
    </div>
</section>

              
        <section className="pb-10">
          <div className="p-10 bg-white rounded-lg border border-gray-200">

          <h2 className="text-3xl font-bold mb-4">Key Partners</h2>
          <div className="flex justify-around gap-4 flex-wrap">
            <ProfileCard
              profileImage="https://avatars.githubusercontent.com/u/49885974?v=4"
              name="Yaninthé Tiomene"
              contact="https://github.com/Yantiomene"
              about="Backend Developer"
            />
            <ProfileCard
              profileImage="https://avatars.githubusercontent.com/u/81225469?v=4"
              name="Esmond Adjei"
              contact="https://github.com/esmond-adjei"
              about="Fullstack Developer"
            />
            <ProfileCard
              profileImage="https://avatars.githubusercontent.com/u/24933447?v=4"
              name="Gregory Slippi-Mensah"
              contact="https://github.com/GHMatrix"
              about="Frontend Developer"
            />
          </div>
                      
          </div>
        </section>

          </div>
        </>
    );
};

export default Home;
