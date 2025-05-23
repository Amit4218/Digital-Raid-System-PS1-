import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import axios from "axios";
import kan from "../Images/kan.jpg";
import { FaUser, FaLock } from "react-icons/fa";
import Police from "../Images/sikkimpolice-removebg-preview.png";
import Skm from "../Images/skm.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();
  const data = { email, password };

  const loginHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        data
      );

      if (r.status === 200) {
        localStorage.setItem("token", r.data.token);
        localStorage.setItem("adminId", r.data.user._id);
        localStorage.setItem(
          "adminpicture",
          r.data.user.personalDetails.picture
        );
        setTimeout(() => setloading(false), 500);
        navigate("/admin");
        toast.success("Logged in successfully");
      } else {
        setTimeout(() => setloading(false), 300);
        toast.error(r.data.message);
      }
    } catch (err) {
      setTimeout(() => setloading(false), 300);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${kan})` }}
    >
      {/* Header Text */}
      <div className="flex items-center space-x-6 mb-6">
        <p className="text-white font-bold text-4xl">SIKKIM POLICE</p>
        <p className="text-white text-2xl font-semibold glow-effect">
          TO PROTECT AND SERVE
        </p>
      </div>

      {/* Container */}
      <div className="flex items-center justify-center">
        {/* Logo Box */}
        <div className="flex flex-col justify-center h-[450px] w-96 border-4 border-amber-500 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-center items-center h-full">
            <img
              src={Police}
              alt="Sikkim police logo"
              className="h-74 object-contain"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="h-[450px] w-96 backdrop-blur-md border-2 border-white border-l-0 rounded-r-2xl shadow-2xl text-white p-10 flex items-center">
          <form id="login-form" onSubmit={loginHandler} className="w-full">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-4 mb-16">
                <FaUser className="text-white text-xl" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-500/80 text-white px-4 py-2   rounded focus:outline-none"
                  placeholder="Username"
                  id="userName"
                />
              </div>

              <div className="flex items-center gap-4 mb-24">
                <FaLock className="text-white text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-500/80 text-white px-4 py-2 rounded focus:outline-none"
                  placeholder="Password"
                  id="password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-lime-600 transition-colors py-2 rounded-md font-bold cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Glow Effect */}
      <style jsx>{`
        .glow-effect {
          text-shadow: 0 0 30px rgba(132, 204, 22, 0.8);
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          }
          to {
            text-shadow: 0 0 10px rgba(132, 204, 22, 0.8),
              0 0 15px rgba(132, 204, 22, 0.6);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
