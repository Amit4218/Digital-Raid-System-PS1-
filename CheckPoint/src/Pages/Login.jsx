import React, { useState } from "react";
import { FaUserShield, FaLock, FaSignInAlt } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'

function Login() {
  const [departmentId, setDepartmentId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ departmentId, password });
  };
  const navigate = useNavigate()
  const handleClick = ()=>{
    navigate('/complains')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#1f3143] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUserShield className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#1f3143] mb-2">
            Department Login
          </h1>
          <p className="text-gray-600">
            Enter your credentials to access the system
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Department ID Field */}
            <div className="mb-6">
              <label
                htmlFor="departmentId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserShield className="h-5 w-5 text-[#1f3143]" />
                </div>
                <input
                  type="text"
                  id="departmentId"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f3143] focus:border-[#1f3143] transition"
                  placeholder="Enter your department ID"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#1f3143]" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1f3143] focus:border-[#1f3143] transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleClick}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#1f3143] hover:bg-[#152435] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f3143] transition-colors"
            >
              <FaSignInAlt className="mr-2" />
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 text-center">
            <a
              href="#"
              className="text-sm font-medium text-[#1f3143] hover:text-[#152435]"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
