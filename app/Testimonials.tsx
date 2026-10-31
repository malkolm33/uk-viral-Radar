import { testimonials } from "./lib/testimonials";

export default function Testimonials() {
  // No section at all until real, permissioned reviews exist - an empty
  // "reviews coming soon" block reads as weak social proof to visitors.
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          What early users are saying
        </h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg border border-[#E4E7EC] bg-white p-6">
            <p className="text-sm leading-relaxed text-[#0F172A]">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-xs font-medium text-[#0F172A]">{t.name}</p>
            <p className="text-xs text-[#64748B]">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}