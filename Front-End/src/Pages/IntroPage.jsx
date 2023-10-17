/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "../Components/Button";
import { Link } from "react-router-dom";
import ExpandablePanel from "../Components/ExpandablePanel";

const slides = [
  {
    title: "Welcome to GetHelp",
    description:
      "Your path to emotional well-being starts here. Join over 1 million people who are taking charge of their mental health.",
  },
  {
    title: "Why Choose GetHelp?",
    description:
      "GetHelp offers a convenient, affordable, and efficient way to access professional counseling anytime, anywhere.",
  },
  {
    title: "What Our Clients Say",
    description: [
      {
        author: "John Doe",
        testimonial:
          '"GetHelp has been a game-changer for me. I can\'t thank my counselor enough for their support and guidance."',
      },
      {
        author: "Alice Smith",
        testimonial:
          '"The convenience and flexibility of GetHelp have allowed me to prioritize my mental health in my busy life. Highly recommended!"',
      },
      {
        author: "Mark Johnson",
        testimonial:
          '"I was skeptical at first, but GetHelp exceeded my expectations. The therapists are compassionate and understanding."',
      },
    ],
  },
];

const Slide = ({ title, description }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg text-center bg-slate-100">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const TestimonialSlide = ({ testimonials }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-slate-100">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="mb-4">
          <p className="font-bold">{testimonial.author}</p>
          <p>{testimonial.testimonial}</p>
        </div>
      ))}
    </div>
  );
};

const IntroPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds (5000 milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-4 flex justify-center min-h-[300px]">
        {slides.map((slide, index) => (
          <div key={index} className={index === currentSlide ? "" : "hidden"}>
            {index !== 2 ? (
              <Slide title={slide.title} description={slide.description} />
            ) : (
              <TestimonialSlide testimonials={slide.description} />
            )}
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-4">Welcome to GetHelp</h1>
      <p className="text-lg mb-8">
        Your path to emotional well-being starts here. Join over 1 million
        people who are taking charge of their mental health.
      </p>
      <Button
        secondary
        rounded
        className="px-6 py-3 text-white focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
      >
        <Link to={"/home"}>Get Started</Link>
      </Button>
      <section className="my-12 mx-24">
        <div className="flex justify-between mt-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Choose GetHelp?</h2>
            <p>
              GetHelp offers a convenient, affordable, and efficient way to
              access professional counseling anytime, anywhere.
            </p>
          </div>
          <img
            src={"..\\src\\assets\\care-1.png"}
            alt={`Care Image`}
            className="max-h-[500px] max-w-[500px]"
          />
        </div>
      </section>
      <section className="mx-36 w-4/5">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <ExpandablePanel
            header={<p className="font-bold">Q: How does GetHelp work?</p>}
          >
            <p>
              A: After signing up and completing a short questionnaire, youll be
              matched with a licensed counselor who best meets your needs. You
              can then start communicating via secure messaging or choose other
              communication methods.
            </p>
          </ExpandablePanel>
          <ExpandablePanel
            header={
              <p className="font-bold">Q: Is my information confidential?</p>
            }
          >
            <p>
              A: Yes, your privacy is a top priority. GetHelp uses secure and
              encrypted technology to protect your information.
            </p>
          </ExpandablePanel>
          <ExpandablePanel
            header={<p className="font-bold">Q: Can I switch counselors?</p>}
          >
            <p>
              A: Absolutely. If you feel your counselor isnt the right fit, you
              can switch to another counselor at any time.
            </p>
          </ExpandablePanel>
        </div>
      </section>
      <section className="my-12 mx-16">
        <h2 className="text-2xl font-bold mb-4">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="font-bold">John Doe</p>
            <p>
              GetHelp has been a game-changer for me. I cant thank my counselor
              enough for their support and guidance.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="font-bold">Alice Smith</p>
            <p>
              The convenience and flexibility of GetHelp have allowed me to
              prioritize my mental health in my busy life. Highly recommended!
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="font-bold">Mark Johnson</p>
            <p>
              I was skeptical at first, but GetHelp exceeded my expectations.
              The therapists are compassionate and understanding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
