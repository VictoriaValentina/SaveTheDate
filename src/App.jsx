import { useState, useEffect } from "react";
import { Envelope } from "./components/Envelope";
import InvitationCard from "./components/InvitationCard";
import { RSVPForm } from "./components/RSVPForm";

export default function App() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showRSVPForm, setShowRSVPForm] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#rsvp" && envelopeOpen) {
        setShowRSVPForm(true);
      }
    };

    const handleOpenRSVP = () => {
      setShowRSVPForm(true);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("openRSVP", handleOpenRSVP);
    handleHashChange(); // Verificar ao montar

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("openRSVP", handleOpenRSVP);
    };
  }, [envelopeOpen]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* InvitationCard sempre visível */}
      <InvitationCard entering={!envelopeOpen} showRSVPForm={showRSVPForm} />

      {/* Modal RSVP Form sobreposto */}
      {showRSVPForm && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setShowRSVPForm(false)}
            className="absolute top-6 right-6 bg-white rounded-full w-12 h-12 flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100 transition-all z-50"
          >
            ✕
          </button>
          <RSVPForm onSubmit={() => setShowRSVPForm(false)} />
        </div>
      )}

      {/* Envelope sobrepõe tudo e some ao expandir */}
      {!envelopeOpen && (
        <div className="absolute inset-0 z-50">
          <Envelope onOpen={() => setEnvelopeOpen(true)} />
        </div>
      )}
    </div>
  );
}
