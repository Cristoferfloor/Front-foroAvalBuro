import Introduction from "@/src/components/introduction";
import TransitionPage from "@/src/components/transition-page";
import { a } from "framer-motion/client";
import { main } from "framer-motion/m";
import Image from "next/image";

export default function Home() {
  return (
  <main>
    <TransitionPage/>

    <div>
      <Introduction/>
    </div>
  </main>
  );
}
