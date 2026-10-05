import { useState, useMemo, useRef } from "react";
import { Minus, Plus, ChevronDown, ShoppingBag } from "lucide-react";

// ---------------------------------------------------------------------------
// Types — shape your API response (or map it) to this before passing it in.
// ---------------------------------------------------------------------------
export interface ProductVariant {
  id: string;
  label: string; // e.g. "Queen elegant mattress 60*72"
  price?: number; // optional: overrides base price when selected
  inStock?: boolean;
}

export interface ProductAccordionSection {
  title: string;
  content: string;
}

export interface ProductBadge {
  icon?: string; // emoji or short label, e.g. "🚚"
  title: string;
  subtitle?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number; // for strike-through / discount display
  currency?: string; // defaults to INR
  images: string[];
  variants?: ProductVariant[]; // e.g. sizes
  variantLabel?: string; // e.g. "Size", "Color"
  badges?: ProductBadge[];
  accordion?: ProductAccordionSection[];
  inStock?: boolean;
}

interface ProductShowcaseProps {
  product?: Product;
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (payload: { productId: string; variantId?: string; quantity: number }) => void;
  onBuyNow?: (payload: { productId: string; variantId?: string; quantity: number }) => void;
}

// Descriptions longer than this are shortened on top and shown in full
// in the product information section below.
const DESCRIPTION_PREVIEW_LIMIT = 180;

// ---------------------------------------------------------------------------

function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Cuts text at a word boundary and adds an ellipsis.
function getPreview(text: string, limit: number) {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function GallerySkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] w-full animate-pulse bg-stone-200" />
      ))}
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-6 w-2/3 animate-pulse rounded bg-stone-200" />
      <div className="h-5 w-1/3 animate-pulse rounded bg-stone-200" />
      <div className="h-24 w-full animate-pulse rounded bg-stone-200" />
      <div className="h-10 w-full animate-pulse rounded bg-stone-200" />
    </div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full bg-stone-100" />;
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={images[active].url}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border ${i === active ? "border-stone-900" : "border-transparent"
                }`}
            >
              <img src={img.url} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantSelector({
  label,
  variants,
  selectedId,
  onSelect,
}: {
  label: string;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-stone-700">{label}</p>
      <div className="flex flex-col gap-2">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const disabled = v.inStock === false;
          return (
            <button
              key={v.id}
              disabled={disabled}
              onClick={() => onSelect(v.id)}
              className={`w-full rounded-sm border py-2.5 text-[13px] font-medium tracking-wide transition-colors ${disabled
                  ? "cursor-not-allowed border-stone-200 bg-stone-50 text-stone-300"
                  : active
                    ? "border-[#241a14] bg-[#241a14] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                }`}
            >
              {v.label}
              {disabled ? " (out of stock)" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center rounded-sm border border-stone-300">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="px-3 py-2.5 text-stone-600 hover:bg-stone-100"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="px-3 py-2.5 text-stone-600 hover:bg-stone-100"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Badges({ badges }: { badges: ProductBadge[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-stone-200 bg-stone-50 p-4">
      {badges.map((b) => (
        <div key={b.title} className="flex items-start gap-3">
          {b.icon && <span className="text-lg leading-none">{b.icon}</span>}
          <div>
            <p className="text-[13px] font-medium text-stone-900">{b.title}</p>
            {b.subtitle && <p className="text-[12px] text-stone-500">{b.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Accordion({
  sections,
  open,
  onToggle,
}: {
  sections: ProductAccordionSection[];
  open: number | null;
  onToggle: (index: number | null) => void;
}) {
  if (sections.length === 0) return null;
  return (
    <div className="divide-y divide-stone-200 border-t border-stone-200">
      {sections.map((s, i) => (
        <div key={`${s.title}-${i}`}>
          <button
            onClick={() => onToggle(open === i ? null : i)}
            className="flex w-full items-center justify-between py-3 text-left text-[12px] font-medium uppercase tracking-wide text-stone-800"
          >
            {s.title}
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="whitespace-pre-line pb-3 text-[13px] leading-relaxed text-stone-600">
              {s.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function ProductShowcase({
  product,
  loading,
  error,
  onAddToCart,
  onBuyNow,
}: ProductShowcaseProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product?.variants?.[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<number | null>(null);

  const infoRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === selectedVariantId) ?? null,
    [product, selectedVariantId]
  );

  const description = product?.description?.trim() ?? "";
  const isLongDescription = description.length > DESCRIPTION_PREVIEW_LIMIT;

  // Long descriptions get their own "Description" section at the top of the
  // product information list, so the whole text is available below.
  const accordionSections = useMemo<ProductAccordionSection[]>(() => {
    const base = product?.accordion ?? [];

    return isLongDescription
      ? [{ title: "Description", content: description }, ...base]
      : base;
  }, [product?.accordion, isLongDescription, description]);

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const currency = product?.currency ?? "INR";
  const outOfStock = product?.inStock === false || selectedVariant?.inStock === false;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <p className="text-stone-600">Couldn&apos;t load this product. {error}</p>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <GallerySkeleton />
          <InfoSkeleton />
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (outOfStock) return;
    onAddToCart?.({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    onBuyNow?.({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
  };

  // Opens the Description section (index 0) and scrolls it into view.
  const handleReadMore = () => {
    setOpenSection(0);

    requestAnimationFrame(() => {
      infoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <Gallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
          <div>
            <h1 className="font-serif text-2xl text-stone-900">{product.name}</h1>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-lg text-stone-800">{formatPrice(displayPrice, currency)}</p>
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <p className="text-sm text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice, currency)}
                </p>
              )}
            </div>
            {outOfStock && (
              <p className="mt-1 text-[13px] font-medium text-red-600">Out of stock</p>
            )}
          </div>

          {/* Description: full text if short, preview + link if long */}
          {description && (
            <div>
              {isLongDescription ? (
                <>
                  <p className="text-[14px] leading-relaxed text-stone-600">
                    {getPreview(description, DESCRIPTION_PREVIEW_LIMIT)}
                  </p>

                  <button
                    type="button"
                    onClick={handleReadMore}
                    className="mt-2 text-[12px] font-medium uppercase tracking-wide text-[#241a14] underline underline-offset-4 transition-colors hover:text-stone-500"
                  >
                    Read full description
                  </button>
                </>
              ) : (
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-stone-600">
                  {description}
                </p>
              )}
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              label={product.variantLabel ?? "Options"}
              variants={product.variants}
              selectedId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />
          )}

          <div className="flex items-stretch gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#241a14] text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-[#33261d] disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="w-full rounded-sm border border-[#241a14] py-2.5 text-[13px] font-medium tracking-wide text-[#241a14] transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-300"
          >
            Buy it now
          </button>

          {product.badges && <Badges badges={product.badges} />}

          <div ref={infoRef} className="scroll-mt-6">
            <Accordion
              sections={accordionSections}
              open={openSection}
              onToggle={setOpenSection}
            />
          </div>
        </div>
      </div>
    </main>
  );
}