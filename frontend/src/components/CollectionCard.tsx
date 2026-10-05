import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CollectionCard({
  title,
  count,
  image,
  index = 0,
  span = "normal",
}: {
  title: string;
  count: string;
  image: string;
  index?: number;
  span?: "normal" | "tall" | "wide";
}) {
  const spanClass =
    span === "tall" ? "lg:row-span-2 aspect-[3/4] lg:aspect-auto" :
    span === "wide" ? "lg:col-span-2 aspect-[16/9]" : "aspect-[4/5]";

  return (
    <motion.a
      href="sofas"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className={`group relative overflow-hidden bg-charcoal ${spanClass}`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
      <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-end text-ivory">
        <p className="text-[10px] tracking-[0.35em] uppercase text-ivory/70 mb-2 flex items-center gap-2"><span className="text-[var(--brand-green-muted-dark)]">{count}</span>Designs</p>
        <h3 className="font-display text-3xl md:text-4xl leading-tight">{title}</h3>
        <div className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase">
          <span className="pb-1 border-b border-ivory/40 group-hover:border-ivory/80 transition-colors">
            Explore Collection
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--brand-green-muted)]" />
        </div>
      </div>
    </motion.a>
  );
}
