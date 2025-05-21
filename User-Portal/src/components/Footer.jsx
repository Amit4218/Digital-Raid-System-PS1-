import React from "react";
import img1 from "../Images/QR.png";
import img2 from "../Images/i1.jpg";

const Footer = () => {
  const policyLinks = [
    {
      text: "Terms of Use",
      href: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Website_Term_Policy.aspx?type=1",
    },
    {
      text: "Copyright Policy",
      href: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Website_Term_Policy.aspx?type=2",
    },
    {
      text: "Privacy Policy",
      href: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Website_Term_Policy.aspx?type=3",
    },
    {
      text: "Linking Policy",
      href: "https://excise.sikkim.gov.in/CommonUser/Portal_New_Website_Term_Policy.aspx?type=4",
    },
    {
      text: "Legal Disclaimer",
      href: "https://excise.sikkim.gov.in/Common/Portal_New_legalDisclaimer.aspx",
    },
  ];

  return (
    <footer className="bg-lime-800 text-white mt-10">
      {/* Top Section: Buttons spread evenly */}
      <div className="flex flex-wrap justify-evenly items-center px-10 py-6">
        {policyLinks.map(({ text, href }, idx) => (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-lime-700 hover:bg-lime-600 rounded-full text-sm transition"
          >
            {text}
          </a>
        ))}
      </div>

      {/* Middle Section: Left images, right text */}
      <div className="flex flex-col md:flex-row justify-between items-start px-10 py-8 gap-8">
        {/* Left - Images evenly spread */}
        <div className="flex justify-evenly gap-8 items-center flex-1">
          <img src={img1} alt="QR Code" className="h-24 w-auto" />

          <a
            href="https://excise.sikkim.gov.in/writereaddata/eAbgari_Sikkim_Completion_Certificate_1.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={img2}
              alt="Completion Certificate"
              className="h-24 w-auto cursor-pointer"
            />
          </a>
        </div>

        {/* Right - Info Text */}
        <div className="text-sm space-y-2 max-w-md">
          <p>Project Commissioned - e-Abkari Version 2.0 : 16/07/2021</p>
          <p>Soft Launch of Website : 16/07/2021</p>
          <p>Last Updated : 16/07/2021</p>
          <p>
            Site Designed, hosted by{" "}
            <a
              href="https://www.nic.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-400"
            >
              National Informatics Centre
            </a>
          </p>
          <p>
            Best viewed in{" "}
            <strong>Internet Explorer 10.0 / 11.0 or later</strong>.
          </p>
        </div>
      </div>

      {/* Bottom Section - Centered */}
      <div className="bg-gray-400 text-center text-black text-sm py-3">
        © 2021-2022 | <strong>All rights reserved.</strong>
      </div>
    </footer>
  );
};

export default Footer;
