import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Navbar from "./Navbar";

const PublicGrievanceSignUp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Here you would typically send OTP to the email
    setIsOtpSent(true);
    // Simulate OTP sending
    console.log(`OTP sent to ${email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would verify the OTP
    // For now, we'll just navigate to /complaints
    navigate("/complains");
  };

  return (
    <>
      <Navbar />
      <div className="-mt-20">
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 shadow-xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-green-700">
              Email Verification
            </h2>
            <p className="mt-2 text-center text-sm text-lime-500 font-bold">
              We'll send you a one-time password to verify your email
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl  sm:px-10">
              {!isOtpSent ? (
                // Email Submission Form
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <FaEnvelope className="inline mr-2 text-lime-700" />
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaArrowRight className="h-5 w-5 text-lime-300 group-hover:text-lime-200 transition-colors" />
                      </span>
                      Send OTP
                    </button>
                  </div>
                </form>
              ) : (
                // OTP Verification Form
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      We've sent a 6-digit OTP to <strong>{email}</strong>
                    </p>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <FaShieldAlt className="inline mr-2 text-lime-700" />
                      Enter OTP
                    </label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-sm font-medium text-lime-700 hover:text-lime-800"
                    >
                      Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-sm font-medium text-lime-700 hover:text-lime-800"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors"
                    >
                      Verify & Continue
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicGrievanceSignUp;
