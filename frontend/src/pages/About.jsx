// layouts
import WithHeader from "../layouts/withHeader";
// assets
import { holdDonor } from "../assets";
import ProfileCard from "../components/profileCard";

const AboutPage = () => {
    return(
      <WithHeader>
        <section 
          className="py-10 px-[10%] h-[80vh] bg-red-100 bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center"
          style={{ backgroundImage: `url(${holdDonor})` }}
          >
            <h1 className="text-center text-4xl text-gray-800 font-bold">
              Welcome To Blood+, a digital resource for blood access and donations
            </h1>
        </section>
        
        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
          Blood+ is more than just a platform—it's a community dedicated to saving lives through blood donation. Founded with a vision of ensuring that no one suffers due to a lack of access to blood, our mission is clear: to provide a reliable and accessible resource for blood donations. Our team of passionate volunteers works tirelessly to connect donors with those in need, facilitating life-saving donations that make a real difference. Together, we're making strides towards a world where everyone has access to the blood they need to thrive.
          </p>
        </section>

        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            Our mission is to ensure that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood. We are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood.
          </p>
        </section>

        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg">
            Our vision is to ensure that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood. We are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood.
          </p>
        </section>

        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-lg">
            Our values are to ensure that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood. We are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood.
          </p>
        </section>

        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-lg">
            Our team is committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood. We are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood.
          </p>
        </section>

        <section className="pb-10">
          <div className="pb-10 w-[80%] mx-auto rounded-lg">
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

      </WithHeader>
      );
};
  
export default AboutPage;