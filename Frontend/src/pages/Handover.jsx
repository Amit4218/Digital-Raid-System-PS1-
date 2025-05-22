import React, { useState } from "react";
import EvidenceHandover from "../components/EvidenceHandover";
import CustodyHandover from "../components/CustodyHandover";
import Loading from "../components/Loading";
import TokenValidator from "../utils/tokenValidator";


const Handover = () => {
  TokenValidator();

  const [chooseHandover, setChooseHandover] = useState(true);
  const [loading, setloading] = useState(true);

  setTimeout(() => {
    setloading(false);
  }, 500);

  if (loading) return <Loading />;

  return (
    <div className="p-10 px-15 text-white">
      <h1 className="text-2xl text-center font-semibold text-gray-300 mb-4">
        Choose Handover Type
      </h1>
      <div className="mb-4 flex gap-10">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="handover"
            id="evidence"
            value="evidence"
            checked={chooseHandover}
            onChange={() => setChooseHandover(true)}
          />
          Evidence Handover
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="handover"
            id="custody"
            value="custody"
            checked={!chooseHandover}
            onChange={() => setChooseHandover(false)}
          />
          Custody Handover
        </label>
      </div>

      {chooseHandover ? <EvidenceHandover /> : <CustodyHandover />}
    </div>
  );
};

export default Handover;
