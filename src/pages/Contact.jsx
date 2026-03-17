const Contact = () => {
  return (
    <section id="contact" className="mt-30  bg-slate-900 py-20 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-[10px] uppercase tracking-[0.5em] text-amber-500 mb-4">Get in Touch</h3>
          <h2 className="text-3xl font-serif mb-10">Your personal concierge awaits.</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <input type="text" placeholder="NAME" className="bg-transparent border-b border-white/20 py-4 px-2 text-xs tracking-widest focus:border-amber-500 outline-none transition-colors" />
            <input type="email" placeholder="EMAIL" className="bg-transparent border-b border-white/20 py-4 px-2 text-xs tracking-widest focus:border-amber-500 outline-none transition-colors" />
            <button className="md:col-span-2 mt-6 border border-amber-500 text-amber-500 py-4 uppercase text-[10px] tracking-[0.4em] font-bold hover:bg-amber-500 hover:text-slate-900 transition-all">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>

  );
};

export default Contact;