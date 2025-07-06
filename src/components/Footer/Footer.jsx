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
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Artifact Tracker
          </h2>
          <p className="text-white">
            A web application to explore, track, and contribute information on
            historical artifacts worldwide.
          </p>
          <p className="mt-4 text-sm text-white">
            &copy; {new Date().getFullYear()} Artifact Tracker. All rights
            reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
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
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-white">Email: support@artifacttracker.com</p>
          <p className="text-white">Phone: +880 1234 567890</p>
          <p className="text-white">
            Address: 123 Heritage St, Dhaka, Bangladesh
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-white">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-rose-600 transition-colors duration-300"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-rose-400 transition-colors duration-300"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-rose-700 transition-colors duration-300"
            >
              <FaLinkedinIn size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
