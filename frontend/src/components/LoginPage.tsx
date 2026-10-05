import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { loginUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import GoogleAuthButton from "@/components/GoogleAuthButton";


export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      console.log("Login successful:", data);

      setUser(data.user);

      // Redirect after successful login
      navigate({
        to: "/",
      });
    } catch (error: any) {
      console.error("Login failed:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen overflow-hidden bg-[#F6F1EA]">
      <div className="grid h-full lg:grid-cols-2">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden h-full lg:block"
        >
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200"
            alt="Luxury Interior"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-16 left-16 max-w-md text-white">
            <p className="mb-4 text-xs uppercase tracking-[0.35em]">
              Welcome to Decorden
            </p>

            <h1 className="font-display text-6xl leading-none">
              Luxury made
              <br />
              for everyday
              <br />
              living.
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Sign in to manage orders, wishlist and your premium furniture
              collection.
            </p>
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="h-screen overflow-y-auto"
        >
          <div className="flex min-h-full items-center justify-center px-8 py-10">
            <div className="w-full max-w-md">
              <Link
                to="/"
                className="font-display text-4xl text-charcoal"
              >
                decorden
              </Link>

              <h2 className="mt-8 font-display text-5xl text-charcoal">
                Welcome Back
              </h2>

              <p className="mt-3 text-stone-500">
                Sign in to continue your Decorden experience.
              </p>

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >
                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full border border-stone-300 bg-white px-5 py-4 outline-none transition focus:border-[var(--brand-deep-forest-green)]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-500">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full border border-stone-300 bg-white px-5 py-4 pr-14 outline-none transition focus:border-[var(--brand-deep-forest-green)]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Remember */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-stone-600">
                    <input
                      type="checkbox"
                      className="accent-[var(--brand-deep-forest-green)]"
                    />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[var(--brand-deep-forest-green)] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 bg-[var(--brand-deep-forest-green)] py-4 uppercase tracking-[0.25em] text-white transition hover:bg-[var(--brand-green-muted)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing In..." : "Sign In"}

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
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[var(--brand-deep-forest-green)]"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}