import {
  DISCORD_ICON,
  GOOGLE_ICON,
  PASS_KEY_ICON,
} from "@/assets/web-assets/Assets";
import { Field, SocialBtn, OrDivider } from "@/auth/components/Components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignupForm = ({
  onSignup = () => {},
  onPasskeyLogin = () => {},
  onSubmit = () => {},
  loading = false,
  socialLoading = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({mode: "onTouched"});
  const isLoading = loading || Object.values(socialLoading ?? {}).some(Boolean);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-col gap-2 mb-0.5">
        <SocialBtn
          disabled={isLoading}
          icon={GOOGLE_ICON}
          label="Continue with Google"
          onClick={() => onSignup("google")}
        />
        <div className="flex gap-1.5">
          <SocialBtn
            disabled={isLoading}
            icon={DISCORD_ICON}
            label={<span className="text-[#5865F2] font-bold">Discord</span>}
            onClick={() => onSignup("discord")}
            className="flex-1"
          />
          {/* <SocialBtn
            disabled={true}
            icon={PASS_KEY_ICON}
            label="G"
            onClick={onPasskeyLogin}
            className="flex-1"
          /> */}
        </div>
      </div>

      <OrDivider />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <fieldset disabled={isLoading} className="flex flex-col gap-1.5 disabled:opacity-70">
          <div>
            <Field
              label="Full name"
              placeholder="Anant"
              autoComplete="name"
              aria-invalid={errors.name}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name is too short" },
              })}
            />
            {errors.name && (
              <p role="alert" className="text-[12px] text-red-500 mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p role="alert" className="text-[12px] text-red-500 mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Field
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-invalid={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p role="alert" className="text-[12px] text-red-500 mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 bg-[#1a1814] text-white rounded-xl text-[14px] font-bold tracking-[-0.1px] transition-all hover:bg-[#2c2926] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </fieldset>
      </form>

      <p className="text-[11px] text-[#8a8480] text-center mt-1.5 leading-normal">
        By signing up you agree to Grupio's{" "}
        <Link
          to="/terms"
          className="text-[#D85A30] font-medium hover:underline"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="text-[#D85A30] font-medium hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignupForm;