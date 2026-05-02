import { useState, useEffect } from "react";

const WEDDING_DATE = new Date("2027-04-11T18:00:00");

function useCountdown(targetDate) {
  const calc = () => {
    const diff = targetDate - new Date();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  };
  const [timeLeft, setTimeLeft] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return timeLeft;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function Ornament({ className = "" }) {
  return (
    <div className={`flex items-center gap-4 justify-center ${className}`}>
      <div className="h-px w-8 bg-primary/20" />
      <div className="w-2 h-2 rotate-45 border border-primary/40" />
      <div className="h-px w-8 bg-primary/20" />
    </div>
  );
}

const DETAILS_CARDS = [
  {
    number: "01",
    title: "A Cerimônia",
    text: "Onde o tempo para e o 'nós' se torna eterno. Convidamos vocês para testemunharem nossa união em uma atmosfera de serenidade e encanto.",
    map: true,
  },
  {
    number: "02",
    title: "A Recepção",
    text: "Após o 'sim', celebraremos com mesa farta e a alegria de quem amamos. Preparamos um banquete especial para brindarmos juntos esta nova etapa.",
    image: "src/fotos/buffet.jpg",
  },
  {
    number: "03",
    title: "Lista de Presentes",
    text: "Sua presença é o nosso maior presente! Mas, se desejar nos mimar, nossa lista virtual converte o carinho em experiências para nossa vida a dois.",
    link: "https://noivos.casar.com/victoria-e-breno-2027-02-06",
  },
];

export default function InvitationCard({
  entering = false,
  showRSVPForm = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { days, hours, mins, secs } = useCountdown(WEDDING_DATE);

  const handleRSVPClick = () => {
    // Dispara um evento customizado para que o App.jsx possa ouvir
    window.dispatchEvent(new CustomEvent("openRSVP"));
  };

  return (
    <div
      className={`bg-[#FDFCFB] text-on-background font-body selection:bg-primary/10 transition-opacity duration-700 ${entering ? "opacity-0" : "opacity-100"}`}
    >
      {/* ── Header ── */}
      <header
        className={`fixed top-0 w-full z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-primary/5 transition-all duration-500 ${showRSVPForm ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="font-headline italic text-primary text-2xl tracking-tighter">
            B&V
          </div>

          <button
            className="md:hidden text-primary p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-background border-b border-primary/5 px-6 py-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="font-label text-xs uppercase tracking-widest text-on-surface"
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section
          id="home"
          className="min-h-screen flex items-center pt-28 pb-16"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-6">
            {/* Foto dos Noivos */}
            <div className="relative group lg:order-1 order-2">
              <div className="overflow-hidden rounded-2xl ">
                <img
                  src="src/fotos/principal-nos.png"
                  alt="Noivos"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
            </div>

            {/* Conteúdo Hero */}
            <div className="text-center lg:text-left space-y-12 lg:order-2 order-1">
              {/* Save the Date Banner */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <span className="font-label text-[10px] sm:text-[11px] uppercase tracking-[0.5em] text-primary/60 block">
                    Save the Date
                  </span>
                  {/* Nomes dos Noivos */}
                  <h1 className="font-headline italic text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-on-background tracking-tight pt-4">
                    Breno
                    <span className="block text-2xl sm:text-3xl not-italic font-light text-primary/20 my-3 tracking-[0.3em]">
                      &
                    </span>
                    Victória
                  </h1>
                  <Ornament className="justify-center lg:justify-start" />
                  <div className="space-y-3">
                    <h2 className="font-headline italic text-3xl sm:text-4xl text-on-background">
                      Sim, nós vamos casar!
                    </h2>
                  </div>
                  <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed italic max-w-xl mx-auto lg:mx-0">
                    "De todos os caminhos que a vida nos apresentou, o mais
                    bonito foi aquele que nos levou um ao outro. Entre códigos,
                    sorrisos e o sonho de construir um lar, decidimos que o
                    nosso 'nós' merece ser eterno."
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-headline text-2xl sm:text-3xl text-on-surface-variant leading-none">
                    11 de Abril de 2027
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface/40 mt-3">
                    São Paulo • SP
                  </p>
                </div>
              </div>

              {/* Data, Local e CTA */}
              <div>
                {/* Container Único com bordas superior e inferior */}
                <div className="border-y border-primary/10 py-2">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                    {/* Bloco de Informações (Esquerda) */}
                    {/* Countdown */}
                    <div className="flex justify-center lg:justify-center gap-3 sm:gap-6 pt-8 pb-2">
                      {[
                        { v: days, l: "Dias" },
                        { v: hours, l: "Hrs" },
                        { v: mins, l: "Min" },
                        { v: secs, l: "Seg" },
                      ].map((t, idx) => (
                        <div
                          key={t.l}
                          className="flex flex-col items-center group"
                        >
                          <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.02] group-hover:border-primary/40 group-hover:bg-primary/[0.06] transition-all duration-500">
                            <span className="font-headline text-2xl sm:text-3xl text-primary font-semibold">
                              {pad(t.v)}
                            </span>
                          </div>
                          <span className="font-label text-[7px] uppercase tracking-[0.15em] text-on-surface/50 mt-2.5">
                            {t.l}
                          </span>
                          {idx < 3 && (
                            <span className="text-primary/20 text-sm mt-2">
                              :
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cards de Detalhes ── */}
        <section
          id="detalhes"
          className="max-w-7xl mx-auto px-6 py-12 sm:py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
            {DETAILS_CARDS.map(({ number, title, text, map, image, link }) => (
              <div
                key={title}
                className="px-0 md:px-12 py-12 md:first:pl-0 md:last:pr-0 group flex flex-col h-full"
              >
                <span className="font-headline italic text-6xl text-primary/10 block mb-6 leading-none group-hover:text-primary/20 transition-all duration-700">
                  {number}
                </span>
                <h3 className="font-headline italic text-2xl text-on-background mb-4">
                  {title}
                </h3>
                <div className="w-12 h-px bg-primary/30 mb-6 group-hover:w-20 transition-all duration-500" />
                <p className="font-body text-[15px] text-on-surface-variant leading-relaxed mb-10 min-h-[3.5rem]">
                  {text}
                </p>

                <div className="mt-auto">
                  {map && (
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-primary/5">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.3940699093737!2d-46.550626924563474!3d-23.52781687882288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5e5a7386b5a1%3A0x3e64198feb67ab0a!2sBas%C3%ADlica%20de%20Nossa%20Senhora%20da%20Penha!5e1!3m2!1spt-BR!2sbr!4v1777755049152!5m2!1spt-BR!2sbr"
                        className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                      />
                    </div>
                  )}
                  {image && (
                    <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                      />
                    </div>
                  )}
                  {link && (
                    <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-primary/[0.03] rounded-2xl border border-dashed border-primary/20 group-hover:bg-primary/[0.06] transition-colors">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white text-[11px] uppercase tracking-[0.2em] px-8 py-4 shadow-lg hover:-translate-y-1 transition-all active:scale-95"
                      >
                        Acessar Lista
                      </a>
                      <span className="mt-4 text-[9px] uppercase tracking-widest text-primary/50">
                        Ambiente Seguro
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RSVP Section ── */}
        <section
          id="rsvp"
          className="py-24 sm:py-32 bg-gradient-to-b from-rose-50/50 to-transparent border-t border-rose-200/30"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Ornament className="justify-center mb-6" />
                <h2 className="font-headline italic text-4xl sm:text-5xl text-on-background">
                  Confirme sua Presença
                </h2>
                <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
                  Clique no botão abaixo para confirmar sua presença em nosso
                  grande dia. Você preencherá um breve formulário com seus dados
                  e preferências.
                </p>
              </div>

              <button
                onClick={handleRSVPClick}
                className="inline-block bg-primary text-white font-label text-[11px] uppercase tracking-[0.25em] px-12 py-5 rounded-full shadow-xl hover:bg-primary/95 hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
              >
                Abrir Formulário
              </button>

              <p className="font-body text-[13px] text-on-surface-variant/60 max-w-2xl mx-auto">
                O processo é rápido e simples. Levará menos de 2 minutos.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer id="presentes" className="bg-[#1A1A1A] text-white/90 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-10">
          <div className="relative group">
            <div className="absolute -inset-4 border border-white/10 rounded-full animate-pulse" />
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/20">
              <img
                src="src/fotos/nos-gif.gif"
                alt="B&V"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="font-headline italic text-4xl sm:text-5xl">
              Esperamos por você!
            </h2>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-white/40">
              #CasamentoBrenoEVictoria
            </p>
          </div>

          <div className="w-12 h-px bg-white/20" />

          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-label text-white/50">
            {["Contato"].map((l) => (
              <a
                key={l}
                href="https://w.app/kzw2n9"
                className="hover:text-primary transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <p className="text-[9px] font-body text-white/20 tracking-tighter italic">
            Com amor, Victória & Breno • 2027
          </p>
        </div>
      </footer>
    </div>
  );
}
