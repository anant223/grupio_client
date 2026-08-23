import { useState } from "react";
import { motion } from "framer-motion";
import { BodyContainer } from "@/components/containers/Container";
import { Badge, EmailInput, stagger, fadeUp } from "./Components";
import useWaitlist from "@/hooks/useWaitlist";
import { toast } from "sonner";



const HeroSection = () => {
  const {loading, error: typeError, joinWaitlist} = useWaitlist()
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
      await joinWaitlist(email);
      setSubmitted(true);
      toast.success("Successfully joined the waitlist 🎉");
      e.target.reset()
    }catch (error) {
      toast.error(error.message || "Failed to joinwaitlist")
      e.target.reset()
    }
  };

  return (
    <section className="pt-[clamp(1rem,3vw,2rem)] pb-0">
      <BodyContainer>
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center gap-4 sm:gap-5 pb-[clamp(1.5rem,3vw,2.5rem)]"
        >
          <motion.div variants={fadeUp}>
            <Badge pulse>Building in public · v0.1</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="
          text-[clamp(2rem,5vw,3.75rem)]
          font-medium
          leading-[1.06]
          tracking-[-0.04em]
          text-[#1a1814]
          max-w-[16ch]
          m-0
        "
          >
            Find your people,
            <br />
            find your <span className="text-[#D85A30]">event.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="
          text-[clamp(0.8rem,1.5vw,0.9375rem)]
          leading-[1.75]
          text-[#8a8784]
          max-w-[36ch] sm:max-w-[42ch]
          m-0 px-2 sm:px-0
        "
          >
            Grupio is an events platform built around where you are. Discover
            events nearby, organise your own, and connect with people who share
            your interests.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-1.5 w-full max-w-[min(100%,400px)] px-4 sm:px-0"
          >
            <EmailInput
              onSubmit={handleSubmit}
              loading={loading}
              submitted={submitted}
            />
            {!submitted && (
              <p className="text-[10px] sm:text-[11px] text-[#9b9890] m-0">
                No spam. Just updates when I launch.
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Map — framed, not bleeding */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="
        mx-auto
        rounded-t-2xl sm:rounded-t-3xl
        overflow-hidden
        border border-b-0 border-black/[0.07]
        shadow-[0_8px_40px_rgba(0,0,0,0.08)]
      "
        >
          <img
            src="/map.svg"
            alt="Map showing local events near you on Grupio"
            draggable={false}
            fetchpriority="high"
            width="690"
            height="470"
            className="w-full h-auto block select-none"
          />
        </motion.div>
      </BodyContainer>
    </section>
  );
};


export default HeroSection;