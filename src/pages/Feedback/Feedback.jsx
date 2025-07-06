import React, { useState } from "react";
import Swal from "sweetalert2";

const Feedback = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !feedback.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return;
    }

    try {
      setLoading(true);

      // Simulate API Call delay (replace with real API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your feedback has been submitted successfully.",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setEmail("");
      setFeedback("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mt-16 mx-auto bg-rose-100 bg-opacity-90 text-black p-10 rounded-3xl shadow-2xl border-8 border-white">
      <title>feedback</title>
      <h2 className="text-4xl text-gray-600 font-extrabold mb-8 text-center tracking-wide">
        Your Feedback Matters
      </h2>
      <p className="mb-10 text-center text-gray-600 max-w-lg mx-auto">
        We would love to hear your thoughts and suggestions to improve our
        service.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="email"
            className="block mb-3 text-lg font-semibold tracking-wide"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="
              w-full
              px-6
              py-4
              rounded-xl
              bg-transparent
              border
              border-white
              text-black
              placeholder-rose-400
              focus:outline-none
              focus:ring-4
              focus:ring-rose-400
              focus:border-rose-400
              transition
              duration-300
              ease-in-out
              shadow-lg
              hover:shadow-rose-500
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="feedback"
            className="block mb-3 text-lg font-semibold tracking-wide"
          >
            Your Feedback
          </label>
          <textarea
            id="feedback"
            rows="6"
            placeholder="Write your feedback here..."
            className="
              w-full
              px-6
              py-4
              rounded-xl
              bg-transparent
              border
              border-white
              text-black
              placeholder-rose-400
              focus:outline-none
              focus:ring-4
              focus:ring-rose-400
              focus:border-rose-400
              resize-none
              transition
              duration-300
              ease-in-out
              shadow-lg
              hover:shadow-rose-500
            "
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={loading}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full
            bg-rose-600
            hover:bg-rose-700
            text-black
            font-bold
            py-4
            rounded-xl
            shadow-xl
            transition
            duration-300
            ease-in-out
            flex
            justify-center
            items-center
            gap-3
            ${loading ? "cursor-not-allowed opacity-70" : ""}
          `}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-6 w-6 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </form>
    </section>
  );
};

export default Feedback;
