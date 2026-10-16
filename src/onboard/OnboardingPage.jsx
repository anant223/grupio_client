import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "@/hooks/useAuth";


import OnboardingSuccess from "@/onboard/OnboardingSuccess";
import Preferences from "@/onboard/components/Preferences";
import StepConfirm from "@/onboard/components/StepConfirm";
import LocationInput from '@/components/common/LocationInput';

const TOTAL_STEPS = 3;

function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: step > i ? 24 : 6,
              background: step > i ? "#D85A30" : "#e8e4dc",
            }}
            transition={{ duration: 0.25 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>
      <span className="text-[11.5px] font-semibold tracking-wider text-[#9a9590] uppercase">
        Step {step} of {TOTAL_STEPS}
      </span>
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 px-3.5 py-2.5 mt-4 bg-red-50 border border-red-200/80 rounded-[10px] text-[12.5px] text-red-600 leading-snug"
    >
      <svg
        className="flex-shrink-0 mt-px"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </motion.div>
  );
}

// ─── Nav row ───────────────────────────────────────────────────────────────────
function NavRow({ step, onBack, onNext, onSubmit, isSubmitting, canSubmit }) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/[0.06]">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-4 py-2 text-[#8a8480] hover:text-[#1a1814] text-[13.5px] font-semibold transition-colors disabled:opacity-50"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      ) : (
        <div />
      )}

      {step < TOTAL_STEPS ? (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#D85A30] text-white text-[13.5px] font-bold rounded-xl hover:bg-[#c04e28] active:scale-[0.99] transition-all ml-auto"
        >
          Continue
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#D85A30] text-white text-[13.5px] font-bold rounded-xl hover:bg-[#c04e28] active:scale-[0.99] transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Setting up…
            </>
          ) : (
            "Find Events →"
          )}
        </button>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { onboardingCompletion, onboardingError } = useAuth();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const methods = useForm({ mode: "onTouched" });
  const { watch, trigger, control } = methods;

  const [preferredCategories, interests] = watch([
    "preferredCategories",
    "interests",
  ]);
  const totalCount =
    (preferredCategories?.length ?? 0) + (interests?.length ?? 0);

  const error = localError || onboardingError;

  const goNext = async () => {
    const isValid = await trigger(
      step === 1
        ? ["location"]
        : step === 2
          ? ["interests", "preferredCategories"]
          : []
    );
    if (!isValid) return;
    setLocalError("");
    setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  };

  const goBack = () => {
    setLocalError("");
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const onSubmit = async (data) => {
    console.log("onboarding data:", data);

    if (totalCount < 2) return setLocalError("At least 2 preferences are required.");
    if (totalCount > 5) return setLocalError("Maximum 5 preferences allowed.");

    setLocalError("");
    setIsSubmitting(true);
    try {
      await onboardingCompletion(data);
      setDone(true);
    } catch (err) {
      console.error(err);
      setLocalError(err?.message || "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) return <OnboardingSuccess onContinue={() => navigate("/home")} />;

  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium tracking-[-0.03em] text-[#1a1814]">
            Let's set up your profile.
          </h1>
          <p className="text-sm text-[#6b6966] mt-1.5">
            Tell us what you're into so we can find the right events for you.
          </p>
        </div>

        <motion.div
          className="relative z-[2] w-full max-w-xl mx-auto bg-transparent px-4 sm:bg-white sm:px-7 sm:pt-7 sm:pb-6 sm:rounded-3xl sm:border sm:border-black/[0.08] sm:shadow-[0_2px_24px_rgba(0,0,0,0.05)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <FormProvider {...methods}>
            <ProgressBar step={step} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.18 }}
              >
                {step === 1 && (
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: "Select a location from the suggestions" }}
                    render={({ field, fieldState }) => (
                      <LocationInput
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                )}
                {step === 2 && <Preferences totalCount={totalCount} />}
                {step === 3 && <StepConfirm />}
              </motion.div>
            </AnimatePresence>

            <ErrorBanner message={error} />

            <NavRow
              step={step}
              onBack={goBack}
              onNext={goNext}
              onSubmit={methods.handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              canSubmit={totalCount >= 2 && totalCount <= 5}
            />
          </FormProvider>
        </motion.div>

        <p className="text-[11.5px] text-[#9a9590] text-center mt-5">
          You can update these anytime in profile settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;

