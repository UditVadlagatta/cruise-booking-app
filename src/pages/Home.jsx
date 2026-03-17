const Home = () => {
  return (
    <section id="home" className="mt-20 relative  h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <p className="text-amber-400 text-xs uppercase tracking-[0.6em] mb-4 animate-pulse">Experience the Unthinkable</p>
          <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tight mb-8">
            The Ocean is <br /> <span className="italic font-light">Calling.</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-slate-900 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-500 transition-all">
              Explore Voyages
            </button>
            <button className="text-white border border-white/30 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 backdrop-blur-sm transition-all">
              Watch Film
            </button>
          </div>
        </div>
      </section>
  );
};

export default Home;