"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getWorkerPassportByDid, WorkerPassport } from "@/services/platformService";
import {
  ShieldCheck,
  Star,
  Copy,
  Check,
  Building2,
  Calendar,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  Loader2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function WorkerPassportPage({ params }: { params: Promise<{ did: string }> }) {
  const resolvedParams = use(params);
  const did = decodeURIComponent(resolvedParams.did);

  const [passport, setPassport] = useState<WorkerPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getWorkerPassportByDid(did);
        setPassport(data);
      } catch (err: any) {
        setError(err?.message || "Could not retrieve worker passport.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [did]);

  const copyDid = () => {
    navigator.clipboard.writeText(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code URL generation using standard SVG QR generator endpoint
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(did)}&margin=4`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/platform" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Platform Gateway</span>
          </Link>

          <div className="flex items-center gap-2 font-bold text-sm text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <span>VaaS Universal Digital Passport</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-400 mb-3" />
            <p className="text-sm">Retrieving cryptographic passport from VaaS network...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-950/30 border border-red-500/40 rounded-2xl text-center max-w-md mx-auto my-12">
            <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Passport Not Found</h3>
            <p className="text-xs text-red-300 mb-4">{error}</p>
            <Link
              href="/platform"
              className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl"
            >
              Return to Platform Search
            </Link>
          </div>
        )}

        {passport && (
          <div className="space-y-8">
            {/* Top Digital Identity Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-slate-800 p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Passport Details */}
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographically Verified Gig Identity</span>
                  </div>

                  <h1 className="text-3xl font-extrabold text-white">{passport.name}</h1>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Phone: </span>
                      <span className="font-mono text-slate-200">{passport.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Aadhaar (Last 4): </span>
                      <span className="font-mono text-slate-200">•••• {passport.aadhaarLast4}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Member Since {new Date(passport.memberSince).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* DID Bar */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Universal Decentralized Identifier (DID)
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-teal-400 break-all select-all">
                        {passport.did}
                      </span>
                      <button
                        onClick={copyDid}
                        className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right QR Code Badge */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-center">
                  <div className="p-2 bg-white rounded-xl mb-2 shadow-inner">
                    <img src={qrUrl} alt="VaaS DID QR" className="w-32 h-32 rounded-lg" />
                  </div>
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-teal-400" />
                    <span>Scan to Verify Identity</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Tamper-Proof VaaS QR</div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Universal Trust Score</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-teal-400">{passport.trustScore}</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all"
                    style={{ width: `${passport.trustScore}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cross-Platform Rating</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-4xl font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-8 h-8 fill-amber-400" />
                    {passport.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Aggregated from {passport.totalReviews} verified reviews
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Network Safety Status</div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-bold border ${
                      passport.safetyRiskStatus === "CLEAR"
                        ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
                        : passport.safetyRiskStatus === "WATCHLIST"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}
                  >
                    {passport.safetyRiskStatus === "CLEAR" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span>{passport.safetyRiskStatus}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {passport.safetyRiskStatus === "CLEAR"
                    ? "Zero safety incidents or critical disputes."
                    : "Caution flag logged by partner platform."}
                </div>
              </div>
            </div>

            {/* Connected Platforms */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>Connected Gig Platforms ({passport.affiliations.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {passport.affiliations.map((aff, i) => (
                  <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{aff.platformName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20">
                        {aff.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      ID: <span className="font-mono text-slate-300">{aff.platformWorkerId}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Role: <span className="text-slate-300">{aff.workType}</span>
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Linked on {new Date(aff.onboardedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Review & Incident Ledger */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Universal Performance & Incident Ledger ({passport.reviews.length})
              </h2>

              {passport.reviews.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-6">
                  No platform reviews recorded yet. Initial reputation is in good standing.
                </div>
              ) : (
                <div className="space-y-3">
                  {passport.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border ${
                        rev.flag === "WARNING"
                          ? "bg-amber-950/20 border-amber-500/30"
                          : rev.flag === "CRITICAL_INCIDENT"
                          ? "bg-red-950/20 border-red-500/30"
                          : "bg-slate-950 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Platform: {rev.platformName}</span>
                          {rev.flag !== "NORMAL" && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                              {rev.flag}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{rev.rating}★</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic mb-2">"{rev.comment}"</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Category: {rev.category}</span>
                        <span>Logged on {new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

