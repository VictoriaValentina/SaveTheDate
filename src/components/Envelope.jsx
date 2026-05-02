import { useState } from "react";

export const Envelope = ({ onOpen }) => {
  // "idle" | "open" | "expanding" | "done"
  const [phase, setPhase] = useState("idle");

  const openEnvelope = () => {
    if (phase !== "idle") return;

    setPhase("open");
    setTimeout(() => setPhase("expanding"), 1100);
    // Remove o envelope do DOM após a expansão cobrir a tela
    setTimeout(() => onOpen?.(), 1750);
  };

  const isOpen = phase !== "idle";
  const isExpanding = phase === "expanding";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@300;400&display=swap');

        .env-page {
          min-height: 100vh;
          background: #F7F2EC;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          position: relative;
          overflow: hidden;
          transition: background 0.6s ease;
        }

        /* Fundo some junto com a expansão */
        .env-page.expanding {
          background: transparent;
        }

        .env-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 15% 25%, rgba(160,30,30,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 85% 75%, rgba(160,30,30,0.03) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .env-page.expanding::before {
          opacity: 0;
        }

        .env-scene {
          position: relative;
          width: min(88vw, 560px);
          aspect-ratio: 3/2;
        }

        .env-wrap {
          position: absolute;
          inset: 0;
          transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .env-wrap.vanish {
          opacity: 0;
          transform: scale(0.92);
          pointer-events: none;
        }

        .env-body {
          position: absolute;
          inset: 0;
          border-radius: 2px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 10px 28px rgba(0,0,0,0.08),
            0 28px 60px rgba(0,0,0,0.07),
            inset 0 0 0 1px rgba(255,255,255,0.7);
        }

        .env-back {
          position: absolute;
          inset: 0;
          background: linear-gradient(150deg, #F0EAE0 0%, #E8DFCE 100%);
          border-radius: 2px;
        }

        .env-grain {
          position: absolute;
          inset: 0;
          border-radius: 2px;
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 150px;
        }

        .env-svg { position: absolute; inset: 0; width: 100%; height: 100%; }

        .env-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 52%;
          transform-origin: top center;
          transform-style: preserve-3d;
          perspective: 1400px;
          transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .env-flap.open { transform: rotateX(-172deg); }
        .env-flap-svg { width: 100%; height: 100%; display: block; }

        .env-seal {
          position: absolute;
          left: 50%; top: 52%;
          transform: translate(-50%, -50%);
          z-index: 20;
          cursor: pointer;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .env-seal.vanish {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
        }

        .env-seal-ring {
          width: clamp(50px, 10.5vw, 68px);
          height: clamp(50px, 10.5vw, 68px);
          border-radius: 50%;
          background: radial-gradient(circle at 36% 36%, #C0282A, #7A1010);
          box-shadow:
            0 2px 6px rgba(0,0,0,0.28),
            0 8px 24px rgba(120,16,16,0.28),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -2px 6px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.3s ease;
        }

        .env-seal:hover .env-seal-ring { transform: scale(1.07); }

        .env-seal-ring::before {
          content: '';
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
        }

        .env-seal-ring::after {
          content: '';
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .env-seal-text {
          font-family: 'Cinzel', serif;
          font-size: clamp(10px, 2vw, 13px);
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.1em;
          font-weight: 300;
        }

        .env-seal-hint {
          position: absolute;
          bottom: clamp(-26px, -5vw, -30px);
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Cinzel', serif;
          font-size: clamp(6px, 1.1vw, 8px);
          letter-spacing: 0.5em;
          color: #B4A090;
          white-space: nowrap;
          animation: envBlink 2.6s ease-in-out infinite;
        }

        @keyframes envBlink {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        /* ── Convite ── */
        .invite-wrap {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transform-origin: center center;
          transform: translate(-50%, -50%) scale(0.08);
          transition: none;
        }

        /* Fase 1: convite sobe do envelope */
        .invite-wrap.show {
          opacity: 1;
          pointer-events: all;
          transform: translate(-50%, -50%) scale(1.1);
          transition:
            transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.4s,
            opacity   0.4s ease 0.4s;
        }

        /* Fase 2: expande e revela o InvitationCard por baixo */
        .invite-wrap.expanding {
          opacity: 1;
          transform: translate(-50%, -50%) scale(30);
          transition:
            transform 0.65s cubic-bezier(0.4, 0, 0.6, 1),
            opacity   0.1s ease 0.6s;
        }

        .invite-card {
          position: absolute;
          inset: 0;
          background: #f8f5f6;
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 8px rgba(0,0,0,0.04),
            0 20px 56px rgba(0,0,0,0.12),
            inset 0 0 0 1px rgba(0,0,0,0.04);
        }

        .invite-inner {
          width: 100%; height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(16px, 4%, 32px);
          position: relative;
        }

        .invite-inner::before {
          content: '';
          position: absolute;
          inset: clamp(10px, 2.8%, 16px);
          border: 1px solid rgba(160,30,30,0.18);
          pointer-events: none;
        }

        .invite-inner::after {
          content: '';
          position: absolute;
          inset: clamp(14px, 3.8%, 22px);
          border: 1px solid rgba(160,30,30,0.07);
          pointer-events: none;
        }

        .invite-corner { position: absolute; width: clamp(14px, 3.5vw, 24px); height: clamp(14px, 3.5vw, 24px); opacity: 0.5; }
        .invite-corner svg { width: 100%; height: 100%; }
        .invite-corner.tl { top: clamp(12px, 3%, 20px); left: clamp(12px, 3%, 20px); }
        .invite-corner.tr { top: clamp(12px, 3%, 20px); right: clamp(12px, 3%, 20px); transform: scaleX(-1); }
        .invite-corner.bl { bottom: clamp(12px, 3%, 20px); left: clamp(12px, 3%, 20px); transform: scaleY(-1); }
        .invite-corner.br { bottom: clamp(12px, 3%, 20px); right: clamp(12px, 3%, 20px); transform: scale(-1); }

        .invite-tag {
          font-family: 'Cinzel', serif;
          font-size: clamp(6px, 1.2vw, 9px);
          letter-spacing: 0.55em;
          color: #B02020;
          text-transform: uppercase;
          margin-bottom: clamp(6px, 1.5vh, 12px);
        }

        .invite-hr {
          width: clamp(20px, 5vw, 36px);
          height: 1px;
          background: linear-gradient(90deg, transparent, #B02020 30%, #B02020 70%, transparent);
          margin: clamp(6px, 1.5vh, 12px) auto;
          opacity: 0.5;
          border: none;
        }

        .invite-hr.long { width: clamp(40px, 12vw, 80px); opacity: 0.2; }

        .invite-names {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 5.5vw, 38px);
          font-weight: 300;
          font-style: italic;
          color: #2A2420;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .invite-amp {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 7vw, 50px);
          font-weight: 300;
          font-style: italic;
          color: #B02020;
          display: block;
          line-height: 1.05;
        }

        .invite-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(9px, 2vw, 14px);
          font-style: italic;
          color: #7A6A60;
          letter-spacing: 0.06em;
          margin-top: clamp(2px, 0.5vh, 4px);
        }

        .invite-locale {
          font-family: 'Cinzel', serif;
          font-size: clamp(5px, 1vw, 7px);
          letter-spacing: 0.5em;
          color: #B0A090;
          text-transform: uppercase;
          margin-top: clamp(8px, 1.8vh, 14px);
        }

        .env-footer {
          margin-top: clamp(18px, 3.5vh, 36px);
          font-family: 'Cinzel', serif;
          font-size: clamp(6px, 1vw, 8px);
          letter-spacing: 0.55em;
          color: #C2B8B0;
          transition: opacity 0.5s ease;
        }

        .env-footer.hidden { opacity: 0; }
      `}</style>

      <div className={`env-page${isExpanding ? " expanding" : ""}`}>
        <div className="env-scene">
          {/* ENVELOPE */}
          <div className={`env-wrap${isOpen ? " vanish" : ""}`}>
            <div className="env-body">
              <div className="env-back" />
              <div className="env-grain" />
              <svg
                className="env-svg"
                viewBox="0 0 560 374"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M0 374 L280 205 L560 374 Z" fill="#E6DCCA" />
                <path
                  d="M0 0 L205 205 L0 374 Z"
                  fill="#EAE2D0"
                  opacity="0.55"
                />
                <path
                  d="M560 0 L355 205 L560 374 Z"
                  fill="#EAE2D0"
                  opacity="0.55"
                />
                <line
                  x1="0"
                  y1="374"
                  x2="280"
                  y2="205"
                  stroke="#D8CEBC"
                  strokeWidth="0.4"
                  opacity="0.5"
                />
                <line
                  x1="560"
                  y1="374"
                  x2="280"
                  y2="205"
                  stroke="#D8CEBC"
                  strokeWidth="0.4"
                  opacity="0.5"
                />
              </svg>
            </div>

            <div className={`env-flap${isOpen ? " open" : ""}`}>
              <svg
                className="env-flap-svg"
                viewBox="0 0 560 195"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M0 0 L280 195 L560 0 Z" fill="#F0E8D8" />
                <path
                  d="M0 0 L280 195 L560 0 Z"
                  stroke="#DDD3C0"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path d="M0 0 L140 97 L280 0 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>

            <div
              className={`env-seal${isOpen ? " vanish" : ""}`}
              onClick={openEnvelope}
            >
              <div className="env-seal-ring">
                <span className="env-seal-text">B&amp;V</span>
              </div>
              <span className="env-seal-hint">Abrir</span>
            </div>
          </div>

          <footer className={`env-footer${isOpen ? " hidden" : ""}`}>
            M M X X V I
          </footer>
        </div>
      </div>
    </>
  );
};
