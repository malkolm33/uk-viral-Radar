"use client";

import { useEffect, useRef, useState } from "react";

const SCENES = ["intro", "chart", "card", "outro"] as const;
type Scene = (typeof SCENES)[number];
const DURATIONS: Record<Scene, number> = {
  intro: 3200,
  chart: 6500,
  card: 6500,
  outro: 4200,
};

export default function VideoDemo() {
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState<Scene>("intro");
  const [muted, setMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function scheduleLoop() {
    clearTimers();
    let t = 0;
    SCENES.forEach((s) => {
      timers.current.push(setTimeout(() => setScene(s), t));
      t += DURATIONS[s];
    });
    timers.current.push(setTimeout(scheduleLoop, t));
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (scene === "chart" && canvasRef.current) drawChart(canvasRef.current);
  }, [scene]);

  function drawChart(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const points = [20, 24, 22, 30, 36, 48, 62, 80, 100];
    const max = Math.max(...points);
    const stepX = w / (points.length - 1);
    const toY = (v: number) => h - 8 - (v / max) * (h - 16);
    let progress = 0;

    function frame() {
      progress += 0.03;
      if (progress > 1) progress = 1;
      const count = Math.max(2, Math.floor(points.length * progress));
      ctx!.clearRect(0, 0, w, h);
      ctx!.beginPath();
      ctx!.moveTo(0, toY(points[0]));
      for (let i = 1; i < count; i++) ctx!.lineTo(i * stepX, toY(points[i]));
      ctx!.strokeStyle = "#2563EB";
      ctx!.lineWidth = 2;
      ctx!.lineJoin = "round";
      ctx!.stroke();
      ctx!.lineTo((count - 1) * stepX, h);
      ctx!.lineTo(0, h);
      ctx!.closePath();
      ctx!.fillStyle = "rgba(37,99,235,0.12)";
      ctx!.fill();
      if (progress < 1) requestAnimationFrame(frame);
    }
    frame();
  }

  function startAudio() {
    if (audioCtxRef.current) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    audioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = muted ? 0 : 0.1;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    filter.connect(gain);

    [110, 164.81, 220].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 1 ? "triangle" : "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      g.gain.linearRampToValueAtTime(0.07 / (i + 1), ctx.currentTime + 1.6 + i * 0.3);
    });
  }

  function handleStart() {
    setStarted(true);
    startAudio();
    scheduleLoop();
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (gainRef.current) gainRef.current.gain.value = next ? 0 : 0.1;
      return next;
    });
  }

  if (!started) {
    return (
      <button
        onClick={handleStart}
        className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#64748B]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5 text-[#0F172A]" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-sm font-medium">Play demo (with sound)</p>
      </button>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#0B1220]">
      <button
        onClick={toggleMute}
        aria-label="Mute"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          {muted ? (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25L21 19.73 4.27 3z" />
          ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
          )}
        </svg>
      </button>

      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${scene === "intro" ? "opacity-100" : "opacity-0"}`}>
        <div
          className="absolute h-40 w-40 animate-spin rounded-full"
          style={{
            background: "conic-gradient(from 0deg, rgba(56,189,248,0.35), rgba(56,189,248,0) 30%)",
            maskImage: "radial-gradient(circle, black 55%, transparent 100%)",
          }}
        />
        <p className="relative text-lg font-extrabold text-white">UK Viral Radar</p>
        <p className="relative mt-1 text-[11px] font-medium text-[#93A3B8]">Spot trends before your competitors</p>
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 transition-opacity duration-700 ${scene === "chart" ? "opacity-100" : "opacity-0"}`}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#38BDF8]">Live trend detection</p>
        <canvas ref={canvasRef} width={520} height={140} className="h-[70px] w-full max-w-[260px]" />
        <p className="text-[11px] font-medium text-[#4ADE80]">Search growth +184%</p>
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 transition-opacity duration-700 ${scene === "card" ? "opacity-100" : "opacity-0"}`}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#38BDF8]">Real signals, not guesswork</p>
        <div className="w-full max-w-[220px] rounded-lg border border-[#E4E7EC] bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-[#0F172A]">LED plant grow light</p>
            <span className="rounded-full bg-[#F7F8FA] px-1.5 py-0.5 text-[9px] text-[#64748B]">Home</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#F7F8FA]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8]"
                style={{ width: scene === "card" ? "91%" : "0%", transition: "width 1s ease 0.3s" }}
              />
            </div>
            <span className="text-[10px] font-bold text-[#0F172A]">91</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#64748B]">
            <span>Unique sellers</span>
            <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
              19
              <span className="rounded-full bg-[#DC2626]/10 px-1 py-0.5 text-[8px] font-medium text-[#DC2626]">⚠️ Saturated</span>
            </span>
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${scene === "outro" ? "opacity-100" : "opacity-0"}`}>
        <p className="text-base font-extrabold text-white">UK Viral Radar</p>
        <p className="mt-1 text-[11px] font-semibold text-[#38BDF8]">ukviralradar.com</p>
        <span className="mt-3 rounded-full bg-[#16A34A] px-3 py-1 text-[10px] font-bold text-white">Start free</span>
      </div>
    </div>
  );
}