import React from "react";

function Planned() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-800 p-6 rounded shadow-lg space-y-4">
        <h2 className="text-xl font-bold mb-4 text-center">
          planned Raid Report
        </h2>

        <div>
          <label htmlFor="raidOfficer" className="block mb-1 text-sm">
            Raid Officer
          </label>
          <select
            name="raidOfficer"
            id="raidOfficer"
            value={formData.raidOfficer}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
          >
            <option value="">Select a Raid Officer</option>
            {officers.map((officer, idx) => (
              <option key={idx} value={officer.userName}>
                {officer.userName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="culpritName" className="block mb-1 text-sm">
            Culprit Name
          </label>
          <input
            type="text"
            id="culpritName"
            name="culpritName"
            value={formData.culpritName}
            onChange={handleChange}
            placeholder="Enter culprit name"
            className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-1 text-sm">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="raidDate" className="block mb-1 text-sm">
            Date
          </label>
          <input
            type="date"
            id="raidDate"
            name="raidDate"
            value={formData.raidDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="raidType"
            name="raidType"
            value="unplanned"
            checked={formData.raidType === "unplanned"}
            onChange={handleChange}
            className="text-blue-600"
          />
          <label htmlFor="raidType" className="text-sm">
            Unplanned Raid
          </label>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 text-sm">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter a brief description"
            className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
          ></textarea>
        </div>

        <div className="w-40 h-10 text-xs px-4 py-3 bg-yellow-300 text-center text-black cursor-pointer">
          <button onClick={submitHandler}>Request approval</button>
        </div>
      </div>
    </div>
  );
}

export default Planned;
