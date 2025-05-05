"use client";


import { AnimatePresence, motion } from "framer-motion";
import { transitionVariantsPage } from "../utils/motion-transition";

const TransitionPage = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed top-0 bottom-0 left-0 w-screen z-30 bg-[#4b4b4c]"
        variants={transitionVariantsPage}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      />
    </AnimatePresence>
  );
};

export default TransitionPage;
