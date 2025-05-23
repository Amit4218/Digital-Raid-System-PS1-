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
      className="h-screen w-full flex bg-cover bg-center relative"
      style={{ backgroundImage: `url(${kan})` }}
    >
    
      <div className="w-1/2 flex flex-col p-8">
      
        <div className="flex-grow">
          <p className="text-white font-bold text-4xl mb-4">SIKKIM POLICE</p>
          <p className="text-white text-2xl font-bold glow-effect">
            TO PROTECT AND SERVE
          </p>
        </div>
      </div>

     
      <div className="w-1/2 flex flex-col items-center justify-center">
        <form
          id="login-form"
          onSubmit={loginHandler}
          className="backdrop-blur-md border-2 rounded-2xl shadow-2xl text-white p-10 w-96"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <FaUser className="text-white text-xl" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-500/80 text-white px-4 py-2 rounded focus:outline-none"
                placeholder="Username"
                id="userName"
              />
            </div>

            <div className="flex items-center gap-4">
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
              className="w-full mt-4 bg-lime-400 hover:bg-lime-600 transition-colors py-2 rounded-md font-bold cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

    
      <div className="absolute bottom-8 left-8">
        <img src={Skm} alt="SKM Logo" className="h-32 object-contain" />
      </div>

    
      <div className="absolute bottom-8 right-8">
        <img
          src={Police}
          alt="Sikkim police logo"
          className="h-32 object-contain"
        />
      </div>

  
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
            text-shadow: 0 0 40px rgba(132, 204, 22, 0.8),
              0 0 15px rgba(132, 204, 22, 0.6);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
