import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <header className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black"></div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Neon Weather
          </h1>
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Real-time forecasts with a futuristic edge. Search any city or use your current location.
          </p>
        </div>
      </div>
    </header>
  );
}
