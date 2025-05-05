"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { Waves } from "../utils/Waves";
import Link from "next/link";

const Introduction = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-50">
   
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-20 text-center"
      >
        <TypeAnimation
          sequence={[
            "Welcome to the Communication Forum",
            1000,
            "Welcome to AvalBuro",
            1000,
          ]}
          wrapper="h1"
          speed={50}
          repeat={Infinity}
          className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 bg-clip-text text-transparent md:text-5xl"
        />
        <p className="mt-4 text-lg text-gray-600 md:text-xl">
        share ideas
        </p>
      </motion.div>

 
      <div className="container grid items-center gap-10 px-6 py-12 mx-auto md:grid-cols-2 md:py-24">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <Image
            src="/foro-image.png"
            priority
            width={400}
            height={400}
            alt="Comunidad diversa"
            className="rounded-lg shadow-xl"
          />
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Join the conversation
          </h2>
          
          <div className="space-y-4 text-gray-600">
            <p className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 mt-1 text-pink-500 flex-shrink-0" />
              <span>Share your experiences in a safe space</span>
            </p>
            <p className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
              <span>Meet people with similar experiences</span>
            </p>
            <p className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 mt-1 text-purple-500 flex-shrink-0" />
              <span>Find resources and community support</span>
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-6"
          >
            <Link
              href="/forms"
              className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl hover:gap-3"
            >
              Enter New Comment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Waves/>
    </div>
  );
};

export default Introduction;