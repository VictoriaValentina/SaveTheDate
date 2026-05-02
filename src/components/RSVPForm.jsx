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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleConfirmationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim())
        return setError("Por favor, preencha nome e e-mail.");
      if (!formData.email.includes("@"))
        return setError("Formato de e-mail inválido.");
    }
    if (step === 2 && formData.confirmed_church === "")
      return setError("Confirme sua presença na cerimônia.");
    if (step === 3 && formData.confirmed_barbecue === "")
      return setError("Confirme sua presença na celebração.");

    if (step === 4) {
      const count = Number(formData.companions);
      if (count < 0) return setError("Valor inválido.");
      if (count === 0) {
        setStep(6);
        return;
      }
      setCompanionInputs(Array(count).fill(""));
      setStep(5);
      return;
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
      // Verificar se o email já foi confirmado
      const checkResult = await checkRSVPExists(formData.email);
      if (!checkResult.success) {
        throw new Error("Erro ao verificar confirmação existente.");
      }

      if (checkResult.exists) {
        setError(
          `Olá ${formData.name}! Você já confirmou presença. Se precisar alterar alguma informação, entre em contato conosco.`,
        );
        setLoading(false);
        return;
      }

      // Se não existe, prosseguir com o envio
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md mx-auto border border-rose-100"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">
          Olá {formData.name}, presença confirmada!
        </h2>
        <p className="text-slate-500">
          Estamos muito felizes em ter você conosco neste dia tão especial. ❤️
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4">
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-rose-200/50 overflow-hidden border border-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Elegante */}
        <div className="bg-rose-50/50 px-8 py-10 text-center border-b border-rose-100/50">
          <Heart className="w-6 h-6 text-rose-400 mx-auto mb-3" />
          <h2 className="text-3xl font-serif text-slate-800 tracking-tight">
            RSVP
          </h2>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-medium">
            Confirme sua Presença
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-8 bg-rose-400" : "w-2 bg-rose-200"}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepContainer
                key="s1"
                icon={<Users />}
                title="Identificação"
                sub="Como podemos te encontrar?"
              >
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
                  placeholder="maria@exemplo.com"
                />
              </StepContainer>
            )}

            {step === 2 && (
              <StepContainer
                key="s2"
                icon={<Calendar />}
                title="A Cerimônia"
                sub="11 de Abril de 2027 • 12:30"
              >
                <InfoCard
                  color="blue"
                  icon={<MapPin size={18} />}
                  title="Local Sagrado"
                  text="A cerimônia será realizada na Basilica Nossa Senhora da Penha. Um momento de fé e união."
                />
                <CheckboxCard
                  checked={formData.confirmed_church === "Sim"}
                  onChange={() =>
                    handleConfirmationChange("confirmed_church", "Sim")
                  }
                  label="Sim, comparecerei à cerimônia"
                />
                <CheckboxCard
                  checked={formData.confirmed_church === "Não"}
                  onChange={() =>
                    handleConfirmationChange("confirmed_church", "Não")
                  }
                  label="Não, não poderei comparecer à cerimônia"
                />
              </StepContainer>
            )}

            {step === 3 && (
              <StepContainer
                key="s3"
                icon={<Heart />}
                title="A Comemoração"
                sub="Mesmo dia • A partir das 15:00"
              >
                <InfoCard
                  color="amber"
                  icon={<Users size={18} />}
                  title="Recepcão e celebracão"
                  text="Prepare-se para uma noite de festa, boa música e gastronomia."
                />
                <CheckboxCard
                  checked={formData.confirmed_barbecue === "Sim"}
                  onChange={() =>
                    handleConfirmationChange("confirmed_barbecue", "Sim")
                  }
                  label="Sim, estarei na comemoração"
                />
                <CheckboxCard
                  checked={formData.confirmed_barbecue === "Não"}
                  onChange={() =>
                    handleConfirmationChange("confirmed_barbecue", "Não")
                  }
                  label="Não, não poderei comparecer à comemoração"
                />
              </StepContainer>
            )}

            {step === 4 && (
              <StepContainer
                key="s4"
                icon={<Users />}
                title="Acompanhantes"
                sub="Você trará crianças com você?"
              >
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                  <label className="block text-slate-700 font-medium mb-4 text-center">
                    Quantas crianças?
                  </label>
                  <input
                    type="number"
                    name="companions"
                    value={formData.companions}
                    onChange={handleChange}
                    className="w-full bg-transparent text-4xl text-center font-serif text-rose-500 outline-none focus:ring-0"
                  />
                </div>
              </StepContainer>
            )}

            {step === 5 && (
              <StepContainer
                key="s5"
                icon={<Heart />}
                title="Nomes das Crianças"
                sub="Para nossa organização do buffet"
              >
                {companionInputs.map((name, i) => (
                  <Input
                    key={i}
                    label={`Nome da ${i + 1}ª criança`}
                    value={name}
                    onChange={(e) => {
                      const newInputs = [...companionInputs];
                      newInputs[i] = e.target.value;
                      setCompanionInputs(newInputs);
                    }}
                  />
                ))}
              </StepContainer>
            )}

            {step === 6 && (
              <StepContainer
                key="s6"
                icon={<CheckCircle2 />}
                title="Revisão Final"
                sub="Tudo pronto para o grande dia?"
              >
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm">
                  <ReviewRow label="Convidado" value={formData.name} />
                  <ReviewRow
                    label="Cerimônia"
                    value={formData.confirmed_church}
                  />
                  <ReviewRow
                    label="Festa"
                    value={formData.confirmed_barbecue}
                  />
                  <ReviewRow
                    label="Crianças"
                    value={
                      formData.companions > 0
                        ? `${formData.companions} acompanhante(s)`
                        : "Nenhuma"
                    }
                  />
                </div>
              </StepContainer>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 px-6 rounded-2xl font-semibold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Voltar
              </button>
            )}
            <button
              type={step === 6 ? "submit" : "button"}
              onClick={step === 6 ? undefined : handleNextStep}
              disabled={loading}
              className="flex-[2] py-4 px-6 rounded-2xl font-semibold text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? "Processando..."
                : step === 6
                  ? "Confirmar Presença"
                  : "Continuar"}
              {!loading && step < 6 && <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Sub-componentes auxiliares para organização e elegância
const StepContainer = ({ children, title, sub, icon }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: -20, x: 0 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <div className="inline-flex p-3 bg-rose-50 rounded-xl text-rose-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm">{sub}</p>
    </div>
    {children}
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-200 transition-all outline-none text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

const InfoCard = ({ title, text, color, icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} space-y-2`}>
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
        {icon} {title}
      </div>
      <p className="text-sm leading-relaxed opacity-90">{text}</p>
    </div>
  );
};

const CheckboxCard = ({ checked, onChange, name, label }) => (
  <label
    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${checked ? "border-rose-400 bg-rose-50/50" : "border-slate-100 hover:border-rose-200"}`}
  >
    <div
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? "bg-rose-400 border-rose-400" : "border-slate-300"}`}
    >
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <span
      className={`font-semibold text-sm ${checked ? "text-rose-700" : "text-slate-600"}`}
    >
      {label}
    </span>
  </label>
);

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-200/50 last:border-0">
    <span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
      {label}
    </span>
    <span className="text-slate-700 font-semibold">{value}</span>
  </div>
);
