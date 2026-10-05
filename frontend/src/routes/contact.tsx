import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Loader2, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import { submitConsultation } from "@/lib/consultation";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Decor Den" },
      { name: "description", content: "Visit our flagship showroom or book a private design consultation." },
    ],
  }),
  component: ContactPage,
});

const topics = [
  "General enquiry",
  "Product enquiry",
  "Order support",
  "Delivery",
  "Custom order",
  "Other",
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  website: "", // honeypot, keep hidden
};

const inputClass =
  "h-12 w-full border border-black/10 bg-[#f7f4ee] px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]";

// Showroom location
const LAT = 22.32099645557804;
const LNG = 73.11929922798855;

const MAP_EMBED_URL = `https://www.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`;

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/[^\d+\s-]/g, "") : value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot: bots fill this hidden field, real users never see it
    if (form.website) {
      setSubmitted(true);
      return;
    }

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.message.trim()) return setError("Please write your message.");

    try {
      setLoading(true);
      setError("");

      const description = [
        "Enquiry from Contact page",
        form.subject ? `Topic: ${form.subject}` : null,
        "",
        form.message.trim(),
      ]
        .filter((line) => line !== null)
        .join("\n");

      await submitConsultation({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        description,
      });

      setSubmitted(true);
      setForm(initialForm);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "We couldn't send your message right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container-luxury">
        <SectionHeader
          eyebrow="Contact"
          title="Come |sit awhile|."
          subtitle="Visit the flagship, book a private consultation, or send us a note."
        />

        {/* Info cards */}
        <div className="mt-16 grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: MapPin, title: "Khanpur Gao", text: "Near Sevasi Chokdi, Vadodara, Gujarat 391101" },
            { icon: Phone, title: "Call", text: "+91 92653 59819\nMon–Sat, 10am–8pm" },
            { icon: Mail, title: "Write", text: "N/A\nWe reply within a day" },
          ].map((c) => (
            <div key={c.title} className="p-10 bg-ivory border border-line text-center">
              <c.icon className="h-7 w-7 text-walnut mx-auto" strokeWidth={1.3} />
              <h3 className="mt-5 font-display text-2xl text-charcoal">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                Find us
              </p>

              <h3 className="mt-3 font-display text-3xl text-charcoal">
                Visit the Decorden showroom
              </h3>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#3f6d25] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c]"
            >
              <Navigation size={14} />
              Get directions
            </a>
          </div>

          <div className="overflow-hidden border border-line bg-ivory">
            <iframe
              title="Decorden showroom location"
              src={MAP_EMBED_URL}
              className="block h-[320px] w-full border-0 sm:h-[420px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto mt-16 max-w-3xl border border-line bg-ivory p-6 sm:p-10">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3f6d25]/10 text-[#3f6d25]">
                <Check size={28} />
              </div>

              <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                Message sent
              </p>

              <h3 className="mt-3 font-display text-3xl text-charcoal">
                Thank you for reaching out.
              </h3>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/55">
                We've received your message and will get back to you shortly.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 inline-flex items-center gap-3 bg-[#3f6d25] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#31591c]"
              >
                Send another message
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#3f6d25]">
                Send us a message
              </p>

              <h3 className="mt-3 font-display text-3xl text-charcoal">
                How can we help?
              </h3>

              <form onSubmit={handleSubmit} noValidate className="mt-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs text-black/60">Your name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/60">Phone number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/60">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-black/60">Topic</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a topic</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs text-black/60">Your message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      maxLength={3000}
                      placeholder="Tell us what you're looking for, or how we can help..."
                      className="w-full resize-none border border-black/10 bg-[#f7f4ee] px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-black/30 focus:border-[#3f6d25]"
                    />
                  </div>

                  {/* Honeypot: hidden from real users */}
                  <div
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex h-14 w-full items-center justify-center gap-3 bg-[#3f6d25] text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-[#31591c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-[10px] leading-5 text-black/40">
                  We usually reply within a day.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}