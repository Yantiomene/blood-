import Image from "next/image";

export default function Home() {
  return (
    <div>
    	<br />
      <h1 className="text-4xl font-bold text-center font-montserrat">Welcome To BLOOD+, a digital resource for blood access and donations</h1>
      <section >
        <Image
          src="/blood_donor.jpg"
          width={800}
          height={400}
          alt="Blood Donation"
          className="mx-auto mt-10 w-[80%] rounded-lg"
        />
      </section>
      <footer className="text-center mt-8 text-gray-600 text-sm">
        &copy; 2024 EsmondYanintheGreg. All rights reserved.
      </footer>
    </div>

  );
}
