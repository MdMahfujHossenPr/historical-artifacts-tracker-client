import React, { useState } from "react";
import Swal from "sweetalert2";

const HelpAndSupport = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields",
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
      });
      return;
    }

    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for reaching out to us. We'll get back to you shortly.",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
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
    <section className="max-w-4xl mx-auto m-16 p-8 bg-rose-100 rounded-3xl shadow-lg border-2 border-white">
      <title>help</title>
      <h2 className="text-4xl font-extrabold text-rose-700 mb-8 text-center">
        Help & Support
      </h2>

      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Have questions or need assistance? Check out the common questions below or
        send us a message.
      </p>

      {/* FAQ Section */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-rose-50 p-6 rounded-xl shadow-sm border-2 border-white">
          <h3 className="font-semibold text-rose-700 mb-2">How do I reset my password?</h3>
          <p className="text-gray-700 text-sm">
            You can reset your password by going to the login page and clicking on "Forgot Password".
            Follow the instructions sent to your email.
          </p>
        </div>
        <div className="bg-rose-50 p-6 rounded-xl shadow-sm border-2 border-white">
          <h3 className="font-semibold text-rose-700 mb-2">How do I update my profile?</h3>
          <p className="text-gray-700 text-sm">
            Go to "My Account" page after logging in and update your personal information.
          </p>
        </div>
        <div className="bg-rose-50 p-6 rounded-xl shadow-sm border-2 border-white">
          <h3 className="font-semibold text-rose-700 mb-2">How can I add new artifacts?</h3>
          <p className="text-gray-700 text-sm">
            Navigate to "Add Artifacts" page (must be logged in) and fill out the form to submit new artifacts.
          </p>
        </div>
        <div className="bg-rose-50 p-6 rounded-xl shadow-sm border-2 border-white">
          <h3 className="font-semibold text-rose-700 mb-2">Who can I contact for more help?</h3>
          <p className="text-gray-700 text-sm">
            Use the contact form below or email our support team at support@example.com.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 font-semibold text-gray-700"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-2-rose-400 transition"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-2-rose-400 transition"
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block mb-2 font-semibold text-gray-700"
          >
            Your Message
          </label>
          <textarea
            id="message"
            rows="5"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border-2 border-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-2-rose-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white border-2 border-white font-semibold py-4 rounded-md shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
};

export default HelpAndSupport;
