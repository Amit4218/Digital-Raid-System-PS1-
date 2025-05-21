import React from "react";

const SikkimMap = () => {
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.4974272487287!2d88.61049291506204!3d27.327866822654955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a514e4a99e41%3A0x8800d2a3beee4886!2sSikkim%20Excise%20Department!5e0!3m2!1sen!2sin!4v1686000000000!5m2!1sen!2sin";

  return (
    <iframe
      title="Map"
      src={mapSrc}
      width="600"
      height="400"
      className="border-4 border-green-800 rounded-lg shadow-lg"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default SikkimMap;
