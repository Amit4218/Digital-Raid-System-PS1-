import React from "react";
import Navbar from "../component/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../component/Dashboard";
import Raids from "../component/Raids";
import UnplannedRaids from "../component/UnplannedRaids";
import PlannedRaid from "../component/PlannedRaid";
import RaidRequest from "../component/RaidRequest";
import PendingReview from "../component/PendingReview";
import ActiveReview from "../component/ActiveReview";
import CompletedReview from "../component/CompletedReview";
import ApprovedReview from "../component/ApprovedReview";
import Logs from "../component/status/Logs";

const AdminLanding = () => {
  return (
    <div className="bg-white h-screen w-full">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="raids" element={<Raids />} />
        <Route path="unplannedRaids" element={<UnplannedRaids />} />
        <Route path="/planned-raid" element={<PlannedRaid />} />
        <Route path="/unplanned-request/:raidId" element={<RaidRequest />} />
        <Route path="/pending/:raidId" element={<PendingReview />} />
        <Route path="/active/:raidId" element={<ActiveReview />} />
        <Route path="/completed/:raidId" element={<CompletedReview />} />
        <Route path="/completed_approved/:raidId" element={<ApprovedReview />} />
        <Route path="logs" element={<Logs />} />
      </Routes>
    </div>
  );
};

export default AdminLanding;
