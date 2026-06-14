export default function AuthBrandingPanelSignIn() {
  return (
    <section className="hidden lg:flex lg:w-[40%] bg-primary-container relative flex-col items-center justify-center text-on-primary p-2xl">
      <div className="z-10 text-center flex flex-col items-center max-w-md">
        <span
          className="material-symbols-outlined text-[80px] text-on-primary mb-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          construction
        </span>
        <h1 className="font-display text-display text-on-primary mb-sm">
          Toolsify
        </h1>
        <p className="font-body text-h3 text-on-primary opacity-80 leading-relaxed">
          Access 50+ free tools. Save history &amp; favorites.
        </p>
      </div>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-on-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-white rounded-full blur-[150px]" />
      </div>
    </section>
  );
}
