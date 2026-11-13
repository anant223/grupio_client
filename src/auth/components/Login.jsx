import {
  DISCORD_ICON,
  GOOGLE_ICON,
  PASS_KEY_ICON,
} from "@/assets/web-assets/Assets";
import { Field, SocialBtn, OrDivider } from "@/auth/components/Components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LockOpen } from "lucide-react";


const LoginForm = ({
  onPasskeyLogin=() => {},
  onSubmit = () => {},
  loading = false,
  onLogin = () => {},
  socialLoading = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({mode: "onTouched"});
    const isLoading =
      loading || Object.values(socialLoading ?? {}).some(Boolean);

  return (
    <div className="flex flex-col gap-0">
      {/* social */}
      <div className="flex flex-col gap-2 mb-0.5">
        <SocialBtn
          disabled={isLoading}
          icon={GOOGLE_ICON}
          label="Continue with Google"
          onClick={() => onLogin("google")}
        />
        <div className="flex gap-2">
          <SocialBtn
            icon={DISCORD_ICON}
            disabled={isLoading}
            label={<span className="text-[#5865F2] font-bold">Discord</span>}
            onClick={() => onLogin("discord")}
            className="flex-1"
          />
          <SocialBtn
            icon={<LockOpen size={14}/>}
            label={
              <span className="text-sm font-medium text-gray-600 font-bricolage">
                Guest
              </span>
            }
            onClick={onPasskeyLogin}
            className="flex-1"
          />
        </div>
      </div>

      <OrDivider />

      {/* email form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          disabled={isLoading}
          className="flex flex-col gap-2.5 disabled:opacity-70"
        >
          <div>
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-[12px] text-red-500 mt-0.5"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Field
              label="Password"
              type="password"
              aria-invalid={!!errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password", {
                required: "Credentials are required",
              })}
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-[12px] text-red-500 mt-0.5"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end -mt-1">
            <Link
              to="/forgetPassword"
              className="text-[12px] font-medium text-[#D85A30] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 bg-[#1a1814] text-white rounded-xl text-[14px] font-bold tracking-[-0.1px] transition-all hover:bg-[#2c2926] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-0.5"
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </fieldset>
      </form>

      {/* passkey alt */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onPasskeyLogin}
        className="flex items-center justify-center gap-1.5 mt-3 text-[12px] font-medium text-[#8a8480] hover:text-[#1a1814] transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="7" r="4" />
          <path d="M18 21v-1a4 4 0 0 0-4-4h-1" />
          <circle cx="19" cy="11" r="3" />
          <path d="M22 14l-3-3-3 3" />
        </svg>
        Sign in with a passkey instead
      </button>
    </div>
  );
};

export default LoginForm;