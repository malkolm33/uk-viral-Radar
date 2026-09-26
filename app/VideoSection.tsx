import VideoDemo from "./VideoDemo";

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
        <div className="mx-auto mt-8 aspect-video max-w-sm overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F7F8FA]">
          <VideoDemo />
        </div>
      </div>
    </section>
  );
}