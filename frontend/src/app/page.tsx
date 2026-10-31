
"use client";

import Link from "next/link";
import InteractiveCharacters from "@/components/InteractiveCharacters";
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>VaaS</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
              ID Platform
            </span>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-teal-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Identity for the Gig Economy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Verify Once. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                Trusted Everywhere.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Verification-as-a-Service (VaaS) gives gig workers and professionals a secure,
              verifiable digital identity (DID). No more submitting documents repeatedly for each platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
              >
                <span>Create Your Identity</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Highlights */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Instant DID issuance</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Privacy-first hashing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Multi-platform reuse</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Visual */}
          <div className="lg:col-span-5 h-[360px] md:h-[420px] rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800 p-2 relative shadow-2xl overflow-hidden flex items-center justify-center">
            <InteractiveCharacters />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} VaaS (Verification-as-a-Service) &bull; A platform built by Cosbom
      </footer>
    </div>
  );
}
