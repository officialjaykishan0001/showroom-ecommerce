import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useMemo, useState, useId } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { registerUser } from "@/lib/auth";
import GoogleAuthButton from "@/components/GoogleAuthButton";


const SWATCHES = [
  { name: "Walnut", className: "bg-[#6B4A32]" },
  { name: "Linen", className: "bg-[#E4D9C4]" },
  { name: "Brass", className: "bg-[#B08D57]" },
  { name: "Basalt", className: "bg-[#3C3D3A]" },
];

function passwordStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];

function FloatingField({
  label,
  type = "text",
  value,
  onChange,
  rightSlot,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full border-0 border-b border-stone-300 bg-transparent px-0 pb-3 pt-6 text-charcoal outline-none transition-colors placeholder-shown:pt-3 focus:border-[var(--brand-deep-forest-green)] focus-visible:ring-0"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-3 text-xs uppercase tracking-[0.2em] text-stone-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-stone-400 peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-[var(--brand-deep-forest-green)]"
      >
        {label}
      </label>
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--brand-deep-forest-green)] transition-transform duration-300 peer-focus:scale-x-100"
        aria-hidden
      />
      {rightSlot && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  const reduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = useMemo(() => passwordStrength(password), [password]);
  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log("Registration successful:", data);

      setSuccess("Account created successfully. Redirecting to login...");

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate({
          to: "/login",
        });
      }, 1000);
    } catch (error: any) {
      console.error("Registration failed:", error);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="h-screen overflow-hidden bg-[#F6F1EA]">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden h-full overflow-hidden lg:block"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
            alt="A sunlit living room styled with walnut furniture and linen upholstery"
            className="absolute inset-0 h-full w-full object-cover"
            animate={reduceMotion ? {} : { scale: [1, 1.06] }}
            transition={{ duration: 24, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          <div className="absolute bottom-0 left-0 right-0 px-16 pb-12 text-white">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/80">
              Join Decorden
            </p>

            <h1 className="font-display text-6xl leading-[0.95]">
              Beautiful
              <br />
              spaces begin
              <br />
              here.
            </h1>

            <p className="mt-6 max-w-md text-lg text-white/80">
              Create your account to save favourites, track orders and enjoy a
              premium shopping experience.
            </p>

            {/* Signature element: material swatch strip */}
            <div className="mt-10 flex items-center gap-6 border-t border-white/20 pt-6">
              {SWATCHES.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full ring-1 ring-white/40 ${s.className}`}
                    aria-hidden
                  />
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="h-screen overflow-y-auto"
        >
          {/* Mobile top image band */}
          <div className="relative h-40 w-full overflow-hidden lg:hidden">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
              alt="A sunlit living room styled with walnut furniture and linen upholstery"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="flex min-h-full items-center justify-center px-8 py-10">
            <div className="w-full max-w-md">
              <Link to="/" className="font-display text-4xl text-charcoal">
                decorden
              </Link>

              <h2 className="mt-8 font-display text-5xl text-charcoal">
                Create Account
              </h2>

              <p className="mt-3 text-stone-500">
                Join Decorden and discover timeless furniture crafted for your
                home.
              </p>

              <form className="mt-10 space-y-7" onSubmit={handleSignup}>
                <FloatingField label="Full Name" value={name} onChange={setName} />

                <FloatingField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />

                <div>
                  <FloatingField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="text-stone-400 transition hover:text-[var(--brand-deep-forest-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-deep-forest-green)]"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />

                  {/* Strength meter */}
                  <div className="mt-3 flex items-center gap-2" aria-hidden={!password}>
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i < strength
                            ? "bg-[var(--brand-deep-forest-green)]"
                            : "bg-stone-200"
                            }`}
                        />
                      ))}
                    </div>
                    {password && (
                      <span className="w-12 text-right text-[11px] uppercase tracking-[0.1em] text-stone-400">
                        {STRENGTH_LABEL[strength]}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <FloatingField
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={setConfirm}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                        className="text-stone-400 transition hover:text-[var(--brand-deep-forest-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-deep-forest-green)]"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                  {confirmMismatch && (
                    <p className="mt-2 text-xs text-red-600">
                      Passwords don't match yet.
                    </p>
                  )}
                  {confirm && !confirmMismatch && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-[var(--brand-deep-forest-green)]">
                      <Check size={14} /> Passwords match
                    </p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 text-sm text-stone-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 accent-[var(--brand-deep-forest-green)]"
                  />

                  <span>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-[var(--brand-deep-forest-green)] underline underline-offset-2"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-[var(--brand-deep-forest-green)] underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-[var(--brand-deep-forest-green)]">
                    {success}
                  </div>
                )}
                {/* Button */}
                <button
                  type="submit"
                  disabled={!agreed || loading}
                  className="group flex w-full items-center justify-center gap-3 bg-[var(--brand-deep-forest-green)] py-4 uppercase tracking-[0.25em] text-white transition hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? "Creating Account..." : "Create Account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="h-px flex-1 bg-stone-300" />
                <span className="mx-4 text-xs uppercase tracking-[0.2em] text-stone-400">
                  or
                </span>
                <div className="h-px flex-1 bg-stone-300" />
              </div>

              {/* Google */}
              <GoogleAuthButton onError={setError} />

              <p className="mt-8 text-center text-stone-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[var(--brand-deep-forest-green)]"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}