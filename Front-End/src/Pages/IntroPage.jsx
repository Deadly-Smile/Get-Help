/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "../Components/Button";
import { Link } from "react-router-dom";
import ExpandablePanel from "../Components/ExpandablePanel";
import careImage from "../assets/care-1.png";

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
    title: "About me",
    description:
      "I am Anik Saha, a fresh graduate. I used Laravel 10, React, Redux for developing this website.",
  },
];

const Slide = ({ title, description }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg text-center bg-base-100">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p>{description}</p>
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
            <Slide title={slide.title} description={slide.description} />
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-4">Welcome to GetHelp</h1>
      <p className="text-lg mb-8">
        Your path to emotional well-being starts here. Join over 1 million
        people who are taking charge of their mental health.(Dummy text)
      </p>
      <Button secondary rounded className="btn btn-ghost">
        <Link to={"/home"}>Get Started</Link>
      </Button>
      <section className="my-12 mx-24">
        <div className="flex justify-between mt-10 space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <ul className="space-y-2">
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>Post blogs about mental health</span>
              </li>
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>Comment your opinion</span>
              </li>
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>Like or Dislike the posts</span>
              </li>
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>
                  Connect with mental health professional by messaging or video
                  call(free trial over)
                </span>
              </li>
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>
                  Admin option to manage users, doctors and other admins
                </span>
              </li>
              <li className="flex space-x-1">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="checkbox"
                />
                <span>Apply for doctor or admin permissions</span>
              </li>
            </ul>
            {/* <p>
              GetHelp offers a convenient, affordable, and efficient way to
              access professional counseling anytime, anywhere.
            </p> */}
          </div>
          <img
            src={careImage}
            alt={`Care Image`}
            className="max-h-[500px] max-w-[500px]"
          />
        </div>
      </section>
      <section className="mx-36 w-4/5">
        <h2 className="text-2xl font-bold mb-4">
          Frequently Asked Questions(dummy texts)
        </h2>
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
        <h2 className="text-2xl font-bold mb-4">
          What Our Clients Say(Dummy texts)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-lg">
            <p className="font-bold">John Doe</p>
            <p>
              GetHelp has been a game-changer for me. I cant thank my counselor
              enough for their support and guidance.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <p className="font-bold">Alice Smith</p>
            <p>
              The convenience and flexibility of GetHelp have allowed me to
              prioritize my mental health in my busy life. Highly recommended!
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
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
