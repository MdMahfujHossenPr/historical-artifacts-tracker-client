import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-rose-300 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-6 gap-8 items-start">
        {/* Logo Section - Left */}
        <div className="col-span-1 flex flex-col items-center">
          <Link to="/">
            <img
              src="/logo.png" // Navbar এর logo এর পাথ
              alt="Artifact Tracker Logo"
              className="w-16 h-16 object-contain rounded-full shadow-md bg-black"
            />
          </Link>
          <br />
          <h2 className="text-xl font-bold text-white mb-4">
            Artifact Tracker
          </h2>
        </div>

        {/* Main Content Sections - About, Quick Links, Contact */}
        <div className="col-span-4 grid grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <p>
              A web application to explore, track, and contribute information on
              historical artifacts worldwide.
            </p>
            <p className="mt-4 text-sm">
              &copy; {new Date().getFullYear()} Artifact Tracker. All rights
              reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-rose-500 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-artifacts"
                  className="hover:text-rose-500 transition-colors duration-300"
                >
                  All Artifacts
                </Link>
              </li>
              <li>
                <Link
                  to="/add-artifact"
                  className="hover:text-rose-500 transition-colors duration-300"
                >
                  Add Artifact
                </Link>
              </li>
              <li>
                <Link
                  to="/my-artifacts"
                  className="hover:text-rose-500 transition-colors duration-300"
                >
                  My Artifacts
                </Link>
              </li>
              <li>
                <Link
                  to="/liked-artifacts"
                  className="hover:text-rose-500 transition-colors duration-300"
                >
                  Liked Artifacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <p>Email: support@artifacttracker.com</p>
            <p>Phone: +880 1234 567890</p>
            <p>Address: 123 Heritage St, Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Social Media - Right */}
        <div className="col-span-1 flex items-start justify-end space-x-6 text-white text-2xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-rose-600 transition-colors duration-300"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="hover:text-rose-400 transition-colors duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition-colors duration-300"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-rose-700 transition-colors duration-300"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
