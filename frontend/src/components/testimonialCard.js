const TestimonialCard = ({ name, image, testimonial }) => {
    return (
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={image} alt="Testimonial" className="w-full h-64 object-cover object-center" />
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                <p className="text-gray-600">{testimonial}</p>
            </div>
            <p className="text-7xl absolute right-[10px] bottom-[10px] text-gray-200">&quot;</p>
        </div>
    );
};

export default TestimonialCard;
