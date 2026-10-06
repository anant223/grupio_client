import useAuth from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "./components/Signup";
import LoginForm from "./components/Login";
import useSocialAuth from "@/hooks/useSocialAuth";


const AuthPage = () => {
  const { createSession, createAccount, authLoading } = useAuth();
  const {handleSocialAuth, isLoading} = useSocialAuth()
  const navigate = useNavigate();
  const [URLSearchParams] = useSearchParams();
  const tab = URLSearchParams.get("type") || "login";


  const handlePasskeyLogin = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
         
        },
      });
      console.log("passkey credential:", credential);
    } catch (err) {
      console.error("Passkey error:", err);
    }
  };

  const handleLoginSubmit = async (data) => {
    try {
      await createSession(data);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to start session");

    }
  };

  const handleSignupSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      await createAccount(payload)
      navigate(`/auth?type=login`);
    } catch (err) {
      console.error(err?.message)
      toast.error( "Failed to create account");
    }
  };


  return (
    <>
      <div className="max-w-xl mx-auto px-4 pt-2 pb-16">
        {/* Heading */}
        <div className="text-center mb-2">
          <h1
            className="
            text-[clamp(1.25rem,2.5vw,1.75rem)]
        font-medium
        tracking-[-0.03em]
        text-[#1a1814]
      "
          >
            Find events around you.
          </h1>

          <p className="text-sm text-[#6b6966] mt-1.5">
            Discover events and communities around you
          </p>
        </div>

        {/* Auth Card */}
        <motion.div
          className="
      relative z-[2]
      w-full
      max-w-[400px]
      mx-auto

      bg-transparent
      px-4

      sm:bg-white
      sm:px-7
      sm:pt-7
      sm:pb-6
      sm:rounded-3xl
      sm:border
      sm:border-black/[0.08]
      sm:shadow-[0_2px_24px_rgba(0,0,0,0.05)]
    "
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {/* Tab switcher */}
          <div className="flex border-b border-black/[0.08] mb-6">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => navigate(`/auth?type=${t}`)}
                className={`flex-1 h-11 text-[14px] font-semibold relative transition-colors ${tab === t ? "text-[#1a1814]" : "text-[#8a8480] hover:text-[#4a4844]"}`}
              >
                {t === "login" ? "Log in" : "Sign up"}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px]bg-[#D85A30] rounded-t-sm"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Animated form swap */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "login" ? (
                <LoginForm
                  onLogin={handleSocialAuth}
                  onPasskeyLogin={handlePasskeyLogin}
                  onSubmit={handleLoginSubmit}
                  loading={authLoading}
                  socialLoading={isLoading}
                />
              ) : (
                <SignupForm
                  onSignup={handleSocialAuth}
                  onPasskeyLogin={handlePasskeyLogin}
                  onSubmit={handleSignupSubmit}
                  loading={authLoading}
                  socialLoading={isLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
export default AuthPage;