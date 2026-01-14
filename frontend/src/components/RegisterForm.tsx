"use client";

import { registerUser } from "@/services/userService";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Shield, User, Phone, CreditCard, Briefcase, Hash } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  aadhaarLast4: string;
  workType: string;
  platformId: string;
}

const formFields = [
  { label: "Full Name", name: "name", placeholder: "Your Name", icon: User },
  { label: "Phone Number", name: "phone", placeholder: "Your Phone Number", icon: Phone },
  { label: "Aadhaar Number", name: "aadhaarLast4", placeholder: "Your Adhaar Number", icon: CreditCard },
  { label: "Work Type", name: "workType", placeholder: "Eg. Driver/Plumber/Delivery etc.", icon: Briefcase },
  { label: "Platform ID", name: "platformId", placeholder: "Eg. UC-PL0001", icon: Hash },
];

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    aadhaarLast4: "",
    workType: "",
    platformId: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ did: string } | null>(null);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await registerUser({
      name: form.name,
      phone: form.phone,
      aadhaarLast4: form.aadhaarLast4,
      workType: form.workType,
      platformId: form.platformId,
    });

    // assuming backend returns { did: "did:vaas:xyz" }
    setSuccess({ did: response.did });

  } catch (err: any) {
    console.error(err);
    setError("Unable to register. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-display font-bold text-foreground mb-2"
          >
            Registration Complete! 🎉
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            Save your Decentralized ID
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-secondary rounded-xl p-4 text-xs font-mono break-all text-foreground border border-border"
          >
            {success.did}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-primary"
          >
            <Shield className="w-4 h-4" />
            <span>Secured with blockchain technology</span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Register Your Identity
            </h2>
            <p className="text-muted-foreground">
              Verified once. Use everywhere.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {formFields.map((field, index) => {
            const Icon = field.icon;
            const isFocused = focusedField === field.name;
            
            return (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    isFocused ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <input
                    required
                    name={field.name}
                    value={form[field.name as keyof FormData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={field.placeholder}
                    className={`w-full rounded-xl border bg-card pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 ${
                      isFocused 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Identity...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Create Identity</span>
              </>
            )}
          </motion.button>

          <p className="text-xs text-muted-foreground text-center pt-2">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a>
            {" "}&{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}