// components
import Header from '../components/Header';
// assets
import { bloodDonor } from "../assets";

const Home = () => {
    return(
      <>
        <Header />
        <section 
          className="py-10 px-[10%] h-[100vh] bg-red-100 bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center"
          style={{ backgroundImage: `url(${bloodDonor})` }}
          >
            <h1 className="text-center text-4xl text-white font-bold">
              Welcome To Blood+, a digital resource for blood access and donations
            </h1>
        </section>
        
        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
            Blood+ is a digital resource for blood access and donations. We are a team of volunteers who are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood. We are committed to ensuring that blood is available to those who need it. We are driven by the belief that no one should die because they cannot access blood.
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

        <section className="py-10 px-[10%]">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg">
            Contact us at <a href="mailto:help@bloodplus.com" className="text-red-500">
              help@bloodplus.com
            </a>
          </p>
        </section>

      </>
      );
};
  
export default Home;