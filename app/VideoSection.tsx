export default function VideoSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          See it in action
        </h2>
        <p className="mt-3 text-sm text-[#64748B] sm:text-base">
          A quick walkthrough of how UK Viral Radar finds winning products.
        </p>
        <div className="mt-8 flex aspect-video items-center justify-center rounded-lg border border-[#E4E7EC] bg-[#F7F8FA]">
          <div className="flex flex-col items-center gap-3 text-[#64748B]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5 text-[#0F172A]" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Demo video coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}