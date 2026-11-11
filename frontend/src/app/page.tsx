
"use client";

import Link from "next/link";
import InteractiveCharacters from "@/components/InteractiveCharacters";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Building2,
  Share2,
  Star,
  Layers,
  BookOpen,
  ExternalLink,
} from "lucide-react";

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
              Universal Trust Network
            </span>
          </div>

          <nav className="flex items-center gap-3">
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>API Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <Link
              href="/developer/sandbox"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-teal-400 hover:border-slate-700 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Developer Sandbox</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-sm"
            >
              <span>Worker Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-teal-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Platform Identity & Universal Reputation Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              One Identity. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                Shared Trust Across Every Gig Platform.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              When <strong>Uber</strong> onboards a driver, VaaS issues a universal DID. When the same worker registers on <strong>Ola</strong>, Ola instantly gets their verified work history, reviews, and safety rating.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/developer/sandbox"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
              >
                <Building2 className="w-4 h-4" />
                <span>Launch Developer Sandbox (Uber/Ola)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm transition-colors"
              >
                <span>Worker Self-Registration</span>
              </Link>
            </div>

            {/* Highlights */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero Duplicate Verifications</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Star className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Cross-Platform Ratings</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Shared Safety Watchlist</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Visual */}
          <div className="lg:col-span-5 h-[360px] md:h-[420px] rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/20 border border-slate-800 p-2 relative shadow-2xl overflow-hidden flex items-center justify-center">
            <InteractiveCharacters />
          </div>
        </div>

        {/* How It Works Showcase */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
              The VaaS Cross-Platform Flow
            </div>
            <h2 className="text-2xl font-bold text-white">How Uber, Ola & Zomato Connect</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black">
                1
              </div>
              <h3 className="font-bold text-white text-base">Uber Onboards Driver</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uber sends phone & last 4 Aadhaar digits to VaaS API. VaaS generates a universal Decentralized ID (DID) and links Uber as the initial platform.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black">
                2
              </div>
              <h3 className="font-bold text-white text-base">Ola Re-uses Identity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When the same driver applies to Ola, VaaS instantly recognizes them, links their Ola Partner ID, and shares their verified badge and history with zero document re-upload.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black">
                3
              </div>
              <h3 className="font-bold text-white text-base">Universal Reputation Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If Uber logs a warning flag or bad review, Ola, Zomato, and Urban Company immediately see the updated Trust Score and Watchlist status.
              </p>
            </div>
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
