export default function AuthBrandingPanelSignUp() {
  return (
    <section className="hidden lg:flex lg:w-[40%] bg-primary-container relative overflow-hidden flex-col justify-between p-2xl">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span
              className="material-symbols-outlined text-primary-container text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              construction
            </span>
          </div>
          <span className="font-display text-h2 font-extrabold text-white tracking-tight">
            Toolsify
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-sm">
        <h1 className="font-display text-display text-white mb-lg">
          Powerfully Simple Tools.
        </h1>
        <p className="font-body text-h3 text-white/90 leading-relaxed">
          Join thousands of professionals who streamline their workflow with our
          premium utility suite.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-sm text-white/80 font-label">
        <span className="material-symbols-outlined text-sm" aria-hidden="true">verified</span>
        <span>Trusted by 500k+ global users</span>
      </div>
    </section>
  );
}
