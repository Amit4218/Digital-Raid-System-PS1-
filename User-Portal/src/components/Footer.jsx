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
    <footer className="bg-[#33363B] text-gray-300 text-sm">
      {/* Top section with 3 equal columns */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-600">
        {/* Policy Links */}
        <div>
          <h3 className="text-base font-semibold mb-4">Policies</h3>
          <ul className="space-y-2">
            {policyLinks.map(({ text, href }, idx) => (
              <li key={idx}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* QR and Certificate */}
        <div className="flex flex-col items-center space-y-4">
          <img src={img1} alt="QR Code" className="h-24" />
          <img src={img2} alt="Certificate" className="h-12" />
        </div>

        {/* Project Info */}
        <div>
          <h3 className="text-base font-semibold mb-4">Project Details</h3>
          <p>
            <strong>e-Abkari Version 2.0:</strong> 16/07/2021
          </p>
          <p>
            <strong>Soft Launch:</strong> 16/07/2021
          </p>
          <p>
            <strong>Last Updated:</strong> 16/07/2021
          </p>
          <p>
            Hosted by{" "}
            <a
              href="https://www.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              National Informatics Centre
            </a>
          </p>
          <p>Best viewed in IE 10+ / Modern Browsers</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#2C2E33] text-center py-3 text-gray-400 text-xs">
        <p>© 2021–2022</p>
        <p>All rights reserved .</p>
      </div>
    </footer>
  );
};

export default Footer;
