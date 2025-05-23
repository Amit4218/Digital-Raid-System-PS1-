import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../component/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
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

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const AdminLanding = () => {
  const location = useLocation();

  return (
    <div className="bg-white h-screen w-full overflow-hidden">
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="raids"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <Raids />
              </motion.div>
            }
          />
          <Route
            path="unplannedRaids"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <UnplannedRaids />
              </motion.div>
            }
          />
          <Route
            path="/planned-raid"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <PlannedRaid />
              </motion.div>
            }
          />
          <Route
            path="/unplanned-request/:raidId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <RaidRequest />
              </motion.div>
            }
          />
          <Route
            path="/pending/:raidId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <PendingReview />
              </motion.div>
            }
          />
          <Route
            path="/active/:raidId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <ActiveReview />
              </motion.div>
            }
          />
          <Route
            path="/completed/:raidId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <CompletedReview />
              </motion.div>
            }
          />
          <Route
            path="/completed_approved/:raidId"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <ApprovedReview />
              </motion.div>
            }
          />
          <Route
            path="logs"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="h-full"
              >
                <Logs />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default AdminLanding;
