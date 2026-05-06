import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitRSVP, checkRSVPExists } from "../lib/supabase";
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const RSVPForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmed_church: "",
    confirmed_barbecue: "",
    companions: 0,
    companions_names: [],
  });

  const [companionInputs, setCompanionInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null); // Erro específico de e-mail
  const [success, setSuccess] = useState(false);
  const [acknowledgedChildren, setAcknowledgedChildren] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
    if (name === "email") setEmailError(null);
  };

  // VERIFICAÇÃO NO BANCO AO SAIR DO CAMPO
  const handleEmailBlur = async () => {
    if (!formData.email || !formData.email.includes("@")) return;

    try {
      const checkResult = await checkRSVPExists(formData.email);
      if (checkResult.exists) {
        setEmailError("Este e-mail já realizou uma confirmação anteriormente. Utilize outro e-mail.");
      } else {
        setEmailError(null);
      }
    } catch (err) {
      console.error("Erro ao verificar e-mail", err);
    }
  };

  const handleConfirmationChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim())
        return setError("Por favor, preencha nome e e-mail.");
      if (!formData.email.includes("@"))
        return setError("Formato de e-mail inválido.");
      if (emailError)
        return setError("Não é possível prosseguir com um e-mail já cadastrado.");
      
      // Verificação dupla por segurança antes de mudar de step
      setLoading(true);
      const checkResult = await checkRSVPExists(formData.email);
      setLoading(false);
      if (checkResult.exists) {
        setEmailError("Este e-mail já realizou uma confirmação. Utilize outro e-mail.");
        return setError("E-mail já cadastrado.");
      }
    }
    
    if (step === 2 && formData.confirmed_church === "")
      return setError("Confirme sua presença na cerimônia.");
    if (step === 3 && formData.confirmed_barbecue === "")
      return setError("Confirme sua presença na celebração.");

    if (step === 4) {
      if (!acknowledgedChildren) return setError("Confirme a ciência das regras de crianças.");
      const count = Number(formData.companions);
      if (count < 0) return setError("Valor inválido.");
      if (count === 0) { setStep(6); return; }
      setCompanionInputs(Array(count).fill(""));
      setStep(5); return;
    }

    if (step === 5) {
      if (companionInputs.some((n) => !n.trim()))
        return setError("Preencha o nome de todos os acompanhantes.");
      setFormData((prev) => ({ ...prev, companions_names: companionInputs }));
    }

    setStep(step + 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await submitRSVP(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => onSubmit?.(), 4000);
      } else throw new Error(result.error);
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md mx-auto border border-rose-100"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">
          Olá {formData.name}, presença confirmada!
        </h2>
        <p className="text-slate-500">Estamos muito felizes em ter você conosco! ❤️</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4">
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-rose-200/50 overflow-hidden border border-white"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-rose-50/50 px-8 py-10 text-center border-b border-rose-100/50">
          <Heart className="w-6 h-6 text-rose-400 mx-auto mb-3" />
          <h2 className="text-3xl font-serif text-slate-800">RSVP</h2>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-8 bg-rose-400" : "w-2 bg-rose-200"}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepContainer key="s1" icon={<Users />} title="Identificação" sub="Como podemos te encontrar?">
                <Input
                  label="Nome Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Maria Silva"
                />
                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="maria@exemplo.com"
                  isError={!!emailError}
                  helperText={emailError || "* Este e-mail é único para sua confirmação."}
                />
              </StepContainer>
            )}

            {step === 2 && (
              <StepContainer key="s2" icon={<Calendar />} title="A Cerimônia" sub="11 de Abril de 2027 • 12:30">
                <InfoCard color="blue" icon={<MapPin size={18} />} title="Local Sagrado" text="Basilica Nossa Senhora da Penha." />
                <CheckboxCard checked={formData.confirmed_church === "Sim"} onChange={() => handleConfirmationChange("confirmed_church", "Sim")} label="Sim, comparecerei à cerimônia" />
                <CheckboxCard checked={formData.confirmed_church === "Não"} onChange={() => handleConfirmationChange("confirmed_church", "Não")} label="Não poderei comparecer" />
              </StepContainer>
            )}

            {step === 3 && (
              <StepContainer key="s3" icon={<Heart />} title="A Comemoração" sub="Mesmo dia • A partir das 15:00">
                <InfoCard color="amber" icon={<Users size={18} />} title="Recepção" text="Prepare-se para uma noite de festa!" />
                <CheckboxCard checked={formData.confirmed_barbecue === "Sim"} onChange={() => handleConfirmationChange("confirmed_barbecue", "Sim")} label="Sim, estarei na comemoração" />
                <CheckboxCard checked={formData.confirmed_barbecue === "Não"} onChange={() => handleConfirmationChange("confirmed_barbecue", "Não")} label="Não poderei comparecer" />
              </StepContainer>
            )}

            {step === 4 && (
              <StepContainer key="s4" icon={<Users />} title="Acompanhantes" sub="Você trará crianças com você?">
                <div className={`bg-amber-50 p-6 rounded-2xl border ${acknowledgedChildren ? 'border-amber-200' : 'border-rose-300 bg-rose-50 animate-pulse'}`}>
                  <p className="text-amber-800 text-sm leading-relaxed italic">
                    <strong>Regra:</strong> Apenas crianças abaixo de 8 anos.
                  </p>
                  <div className="mt-4 flex items-center">
                    <input type="checkbox" id="ack" checked={acknowledgedChildren} onChange={(e) => setAcknowledgedChildren(e.target.checked)} className="mr-3 h-4 w-4 text-rose-600 border-gray-300 rounded" />
                    <label htmlFor="ack" className="text-sm text-amber-900 font-bold italic">Estou ciente da regra de idade.</label>
                  </div>
                </div>
                <div className={`bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4 ${!acknowledgedChildren ? 'opacity-30 pointer-events-none' : ''}`}>
                  <label className="block text-slate-700 font-medium mb-4 text-center text-sm uppercase tracking-widest">Quantas crianças?</label>
                  <input type="number" name="companions" value={formData.companions} onChange={handleChange} disabled={!acknowledgedChildren} className="w-full bg-transparent text-4xl text-center font-serif text-rose-500 outline-none" />
                </div>
              </StepContainer>
            )}

            {step === 5 && (
              <StepContainer key="s5" icon={<Heart />} title="Nomes das Crianças" sub="Para organização do buffet">
                {companionInputs.map((name, i) => (
                  <Input key={i} label={`Nome da ${i + 1}ª criança`} value={name} onChange={(e) => {
                    const newInputs = [...companionInputs];
                    newInputs[i] = e.target.value;
                    setCompanionInputs(newInputs);
                  }} />
                ))}
              </StepContainer>
            )}

            {step === 6 && (
              <StepContainer key="s6" icon={<CheckCircle2 />} title="Revisão Final" sub="Tudo pronto?">
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm">
                  <ReviewRow label="Convidado" value={formData.name} />
                  <ReviewRow label="Cerimônia" value={formData.confirmed_church} />
                  <ReviewRow label="Festa" value={formData.confirmed_barbecue} />
                  <ReviewRow label="Crianças" value={formData.companions > 0 ? `${formData.companions}` : "Nenhuma"} />
                </div>
              </StepContainer>
            )}
          </AnimatePresence>

          {error && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50 border border-red-100 p-3 rounded-xl mt-6 flex items-center gap-2 text-red-600 text-xs font-bold justify-center">
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-4 text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest">
                <ArrowLeft size={16} /> Voltar
              </button>
            )}
            <button
              type={step === 6 ? "submit" : "button"}
              onClick={step === 6 ? undefined : handleNextStep}
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
            >
              {loading ? "Aguarde..." : step === 6 ? "Confirmar Presença" : "Continuar"}
              {!loading && step < 6 && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const StepContainer = ({ children, title, sub, icon }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
    <div className="text-center">
      <div className="inline-flex p-3 bg-rose-50 rounded-2xl text-rose-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter mt-1">{sub}</p>
    </div>
    {children}
  </motion.div>
);

const Input = ({ label, helperText, isError, ...props }) => (
  <div className="space-y-1.5">
    <label className={`text-[10px] uppercase tracking-[0.2em] font-bold ml-1 transition-colors ${isError ? 'text-red-500' : 'text-slate-400'}`}>
      {label}
    </label>
    <motion.input
      {...props}
      animate={isError ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`w-full px-5 py-4 rounded-2xl transition-all outline-none text-sm font-medium border-2
        ${isError 
          ? "bg-red-50 border-red-200 text-red-900 focus:border-red-400" 
          : "bg-slate-50 border-transparent focus:bg-white focus:border-rose-200 text-slate-700 placeholder:text-slate-300"
        }`}
    />
    {helperText && (
      <div className={`flex items-start gap-1.5 ml-1 mt-1 transition-colors ${isError ? 'text-red-600' : 'text-slate-400'}`}>
        {isError && <AlertCircle size={12} className="mt-0.5 shrink-0" />}
        <p className={`text-[11px] leading-relaxed italic font-medium`}>
          {helperText}
        </p>
      </div>
    )}
  </div>
);

const InfoCard = ({ title, text, color, icon }) => {
  const styles = color === "blue" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100";
  return (
    <div className={`p-5 rounded-2xl border ${styles} space-y-1.5`}>
      <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">{icon} {title}</div>
      <p className="text-xs leading-relaxed opacity-80">{text}</p>
    </div>
  );
};

const CheckboxCard = ({ checked, onChange, label }) => (
  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${checked ? "border-rose-400 bg-rose-50/50 shadow-inner" : "border-slate-50 hover:border-rose-100"}`}>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? "bg-rose-400 border-rose-400" : "border-slate-200"}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className={`font-bold text-xs uppercase tracking-wider ${checked ? "text-rose-700" : "text-slate-500"}`}>{label}</span>
  </label>
);

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
    <span className="text-slate-400 uppercase text-[9px] font-black tracking-[0.15em]">{label}</span>
    <span className="text-slate-800 font-bold text-xs">{value}</span>
  </div>
);