import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-luxury py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-display text-3xl leading-none">
              <img src="/logo.png" alt="DecorDen Logo" className="h-16 w-auto" />
            </div>
            <p className="mt-5 text-sm text-ivory/70 leading-relaxed max-w-sm">
              Crafted for modern homes. Built with heirloom quality. Designed to be lived in for decades.
            </p>
            <div className="flex gap-3 mt-8">
                <a
                  key={1}
                  href="https://www.instagram.com/decorden.luxury_?stkn=MWl0dG1wb2hwaGRqMg=="
                  aria-label="social"
                  className="h-10 w-10 rounded-full border border-ivory/20 flex items-center justify-center hover:text-[var(--brand-green-muted)] hover:border-[var(--brand-green-muted)] hover:bg-transparent transition-colors hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              
            </div>
          </div>

          <FooterColColl
            title="Collections"
            items={["L-Shape Sofas", "Fabric Sofas", "Leather Sofas", "Wooden Sofas", "Recliners", "Sectionals"]}
          />
          <FooterCol
            title="Customer Care"
            items={["Shipping & Delivery", "Custom Orders", "Care Guide", "FAQ"]}
          />
          <FooterCol
            title="Atelier"
            items={["Our Story", "Contact"]}
          />

          <div className="lg:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-green-muted)] mb-4">Visit</div>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Khanpur Gao, <br />
              near Sevasi Chokdi, <br />
              Vadodara, Gujarat 391101
            </p>
            <a href="tel:+919265359819" className="mt-4 inline-block text-sm text-ivory hover:text-[var(--brand-green-muted-dark)] transition-colors">
              +91 92653 59819
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[color:var(--brand-green-muted-dark)]/10 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            {/* Left */}
            <div className="flex flex-col gap-1 text-xs text-ivory/40">
              <p>
                Crafted with premium materials
                <span className="mx-2 text-[var(--brand-green-muted)]">•</span>
                Built to last decades
              </p>

              <p>
                © {new Date().getFullYear()}{" "}
                <span className="text-[var(--brand-green-muted)]">
                  Decorden
                </span>
                . All rights reserved.
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6 text-xs">
              <Link
                to="/privacy"
                className="text-ivory/50 transition-colors duration-300 hover:text-[var(--brand-green-muted)]"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="text-ivory/50 transition-colors duration-300 hover:text-[var(--brand-green-muted)]"
              >
                Terms
              </Link>

              <Link
                to="/cookies"
                className="text-ivory/50 transition-colors duration-300 hover:text-[var(--brand-green-muted)]"
              >
                Cookies
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="lg:col-span-2">
      <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-green-muted)] mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i}>
            <a href={slugifyText(i)} className="text-sm text-ivory/70 hover:text-[var(--brand-green-muted-dark)] transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterColColl({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="lg:col-span-2">
      <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-green-muted)] mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i}>
            <a href='/sofas' className="text-sm text-ivory/70 hover:text-[var(--brand-green-muted-dark)] transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slugifyText(text: string): string {
  return text.trim().replace(/\s+/g, "-");
}