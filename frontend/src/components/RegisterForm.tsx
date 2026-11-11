"use client";

import { registerUser } from "@/services/userService";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Loader2, Shield, User, Phone, CreditCard, Briefcase, Hash } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  aadhaarLast4: string;
  workType: string;
  platformId: string;
}

interface FormFieldConfig {
  label: string;
  name: keyof FormData;
  placeholder: string;
  icon: typeof User;
  maxLength?: number;
}

const formFields: FormFieldConfig[] = [
  { label: "Full Name", name: "name", placeholder: "Your Name", icon: User },
  { label: "Phone Number", name: "phone", placeholder: "10-digit mobile number", icon: Phone, maxLength: 10 },
  { label: "Aadhaar (Last 4 Digits)", name: "aadhaarLast4", placeholder: "e.g. 1234", icon: CreditCard, maxLength: 4 },
  { label: "Work Type", name: "workType", placeholder: "e.g. Driver / Delivery / Plumber", icon: Briefcase },
  { label: "Platform ID", name: "platformId", placeholder: "e.g. UBER-102 or UC-PL001", icon: Hash },
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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Numerical restriction for phone and aadhaarLast4
    if (name === "aadhaarLast4") {
      const sanitized = value.replace(/\D/g, "").slice(0, 4);
      setForm((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    if (name === "phone") {
      const sanitized = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyDid = async () => {
    if (success?.did) {
      await navigator.clipboard.writeText(success.did);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      aadhaarLast4: "",
      workType: "",
      platformId: "",
    });
    setSuccess(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (form.aadhaarLast4.length !== 4) {
      setError("Please enter exactly the last 4 digits of Aadhaar.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        aadhaarLast4: form.aadhaarLast4.trim(),
        workType: form.workType.trim(),
        platformId: form.platformId.trim(),
      });

      setSuccess({ did: response.did });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to register. Please try again.");
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
          className="text-center py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600"
          >
            <Check className="w-8 h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-display font-bold text-foreground mb-2"
          >
            Identity Created! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-sm mb-6"
          >
            Here is your unique Decentralized Identity (DID). You can use this ID to verify with partner platforms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative bg-secondary/80 rounded-xl p-4 text-xs font-mono break-all text-foreground border border-border"
          >
            {success.did}
            <button
              onClick={handleCopyDid}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-sans font-medium rounded-lg bg-card border border-border hover:bg-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy DID</span>
                </>
              )}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-col gap-3"
          >
            <button
              onClick={resetForm}
              className="w-full py-2.5 text-sm font-medium rounded-xl border border-border hover:bg-secondary transition-colors"
            >
              Register Another Worker
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Verifiable cryptographic DID</span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">
              Register Your Identity
            </h2>
            <p className="text-muted-foreground text-sm">
              Verified once. Use across all gig platforms.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 font-medium"
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
                transition={{ delay: index * 0.08 }}
              >
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      isFocused ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <input
                    required
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    className={`w-full rounded-xl border bg-card pl-11 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 text-sm ${
                      isFocused
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Identity...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Create Identity</span>
              </>
            )}
          </motion.button>

          <p className="text-xs text-muted-foreground text-center pt-1">
            Privacy First: Only the last 4 digits of your Aadhaar are hashed.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}