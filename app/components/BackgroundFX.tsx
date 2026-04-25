"use client";

// Lazy-loaded background blobs + scanline — deferred so they don't block FCP
export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#0099FF 1px, transparent 1px), linear-gradient(90deg, #0099FF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#0066FF] rounded-full blur-[150px] opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#0099FF] rounded-full blur-[150px] opacity-15 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FF6B00] rounded-full blur-[180px] opacity-10 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
