import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome To Blood+, a digital resource for blood access and donations</h1>
      <section >
        <Image
          src="/blood_donor.jpg"
          width={800}
          height={400}
          alt="Blood Donation"
          className="mx-auto mt-10 w-[80%] rounded-lg"
        />
      </section>
    </div>
  );
}
