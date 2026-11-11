"use client";

import { useState } from "react";
import Link from "next/link";
import {
  onboardWorker,
  submitReview,
  getWorkerPassportByPhone,
  getWorkerPassportByDid,
  PlatformOnboardResponse,
  WorkerPassport,
} from "@/services/platformService";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  AlertTriangle,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  Loader2,
  Briefcase,
  Phone,
  CreditCard,
  Hash,
  MessageSquare,
  AlertOctagon,
  Copy,
  Check,
} from "lucide-react";

type PlatformType = "Uber" | "Ola" | "Urban Company" | "Zomato";

const PLATFORMS: { name: PlatformType; badge: string; color: string; defaultRole: string; prefix: string }[] = [
  { name: "Uber", badge: "bg-black text-white border-zinc-800", color: "from-zinc-900 to-zinc-800", defaultRole: "Driver", prefix: "UBER-DRV-" },
  { name: "Ola", badge: "bg-lime-500/10 text-lime-400 border-lime-500/30", color: "from-lime-950/40 to-zinc-900", defaultRole: "Driver", prefix: "OLA-PTR-" },
  { name: "Urban Company", badge: "bg-purple-500/10 text-purple-400 border-purple-500/30", color: "from-purple-950/40 to-zinc-900", defaultRole: "Electrician", prefix: "UC-TECH-" },
  { name: "Zomato", badge: "bg-red-500/10 text-red-400 border-red-500/30", color: "from-red-950/40 to-zinc-900", defaultRole: "Delivery Partner", prefix: "ZOM-DEL-" },
];

export default function PlatformPage() {
  const [activePlatform, setActivePlatform] = useState<PlatformType>("Uber");
  const [activeTab, setActiveTab] = useState<"onboard" | "review" | "lookup">("onboard");

  // Onboard Form State
  const [onboardForm, setOnboardForm] = useState({
    name: "",
    phone: "",
    aadhaarLast4: "",
    workType: "Driver",
    platformWorkerId: "UBER-DRV-101",
  });
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardResult, setOnboardResult] = useState<PlatformOnboardResponse | null>(null);
  const [onboardError, setOnboardError] = useState("");

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    phone: "",
    did: "",
    rating: 5,
    category: "Customer Service & Politeness",
    comment: "",
    flag: "NORMAL" as "NORMAL" | "WARNING" | "CRITICAL_INCIDENT",
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Lookup State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<WorkerPassport | null>(null);
  const [searchError, setSearchError] = useState("");

  const [copiedDid, setCopiedDid] = useState(false);

  const handlePlatformChange = (p: PlatformType) => {
    setActivePlatform(p);
    const config = PLATFORMS.find((item) => item.name === p);
    if (config) {
      setOnboardForm((prev) => ({
        ...prev,
        workType: config.defaultRole,
        platformWorkerId: `${config.prefix}${Math.floor(100 + Math.random() * 900)}`,
      }));
    }
  };

  const fillSampleExistingWorker = () => {
    setOnboardForm({
      name: "Rajesh Kumar",
      phone: "9811002233",
      aadhaarLast4: "4321",
      workType: activePlatform === "Zomato" ? "Delivery Partner" : "Driver",
      platformWorkerId: `${PLATFORMS.find((p) => p.name === activePlatform)?.prefix || "PLAT-"}${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardLoading(true);
    setOnboardError("");
    setOnboardResult(null);

    try {
      const res = await onboardWorker({
        platformName: activePlatform,
        platformWorkerId: onboardForm.platformWorkerId,
        name: onboardForm.name,
        phone: onboardForm.phone,
        aadhaarLast4: onboardForm.aadhaarLast4,
        workType: onboardForm.workType,
      });
      setOnboardResult(res);
    } catch (err: any) {
      setOnboardError(err?.message || "Failed to onboard worker.");
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      await submitReview({
        platformName: activePlatform,
        phone: reviewForm.phone.trim() || undefined,
        did: reviewForm.did.trim() || undefined,
        rating: reviewForm.rating,
        category: reviewForm.category,
        comment: reviewForm.comment,
        flag: reviewForm.flag,
      });
      setReviewSuccess(true);
      setReviewForm((prev) => ({ ...prev, comment: "" }));
    } catch (err: any) {
      setReviewError(err?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const query = searchQuery.trim();
      let res: WorkerPassport;
      if (query.startsWith("did:vaas:")) {
        res = await getWorkerPassportByDid(query);
      } else {
        res = await getWorkerPassportByPhone(query);
      }
      setSearchResult(res);
    } catch (err: any) {
      setSearchError(err?.message || "Worker not found in VaaS registry.");
    } finally {
      setSearchLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDid(true);
    setTimeout(() => setCopiedDid(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>VaaS</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-400" />
              Partner Platform Gateway
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Worker Portal
            </Link>
            <div className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-mono">
              B2B REST API v1.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {/* Platform Persona Selector Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
                <span>Active Platform Persona</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Simulate As: <span className="text-teal-400">{activePlatform}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Experience how Uber, Ola, Urban Company, or Zomato onboard workers & query shared trust history.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PLATFORMS.map((p) => {
                const isActive = activePlatform === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => handlePlatformChange(p.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 scale-105"
                        : "bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("onboard")}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "onboard"
                ? "border-teal-400 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            1. Onboard Worker
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "review"
                ? "border-teal-400 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            2. Log Review / Safety Incident
          </button>
          <button
            onClick={() => setActiveTab("lookup")}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "lookup"
                ? "border-teal-400 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="w-4 h-4" />
            3. Universal Passport Lookup
          </button>
        </div>

        {/* TAB 1: ONBOARD WORKER */}
        {activeTab === "onboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                  Onboard to {activePlatform}
                </h2>
                <button
                  type="button"
                  onClick={fillSampleExistingWorker}
                  className="text-xs text-teal-400 hover:underline font-medium"
                >
                  ⚡ Fill Sample Existing Driver
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                When {activePlatform} submits worker details, VaaS instantly detects if they have an active profile or creates a fresh universal DID.
              </p>

              <form onSubmit={handleOnboardSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Worker Full Name
                  </label>
                  <div className="relative">
                    <input
                      required
                      value={onboardForm.name}
                      onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number (10 digits)
                  </label>
                  <div className="relative">
                    <input
                      required
                      maxLength={10}
                      value={onboardForm.phone}
                      onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 9811002233"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Aadhaar (Last 4)
                    </label>
                    <input
                      required
                      maxLength={4}
                      value={onboardForm.aadhaarLast4}
                      onChange={(e) => setOnboardForm({ ...onboardForm, aadhaarLast4: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 4321"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Role / Work Type
                    </label>
                    <input
                      required
                      value={onboardForm.workType}
                      onChange={(e) => setOnboardForm({ ...onboardForm, workType: e.target.value })}
                      placeholder="Driver, Delivery..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {activePlatform} Worker / Partner ID
                  </label>
                  <input
                    required
                    value={onboardForm.platformWorkerId}
                    onChange={(e) => setOnboardForm({ ...onboardForm, platformWorkerId: e.target.value })}
                    placeholder="e.g. UBER-DRV-902"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none font-mono"
                  />
                </div>

                {onboardError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                    {onboardError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={onboardLoading}
                  className="w-full mt-2 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {onboardLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Calling VaaS B2B Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Onboarding Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Response Section */}
            <div className="lg:col-span-7">
              {onboardResult ? (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      onboardResult.newWorker
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {onboardResult.newWorker ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-sm">
                        {onboardResult.newWorker
                          ? "New Worker Profile Created & Verified"
                          : "Worker Recognized! Cross-Platform Profile Found"}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {onboardResult.message}
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Trust Score</div>
                      <div className="text-2xl font-black text-teal-400 mt-1">
                        {onboardResult.trustScore}/100
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Average Rating</div>
                      <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400" />
                        {onboardResult.averageRating.toFixed(1)}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400">Safety Risk</div>
                      <div
                        className={`text-sm font-bold mt-2 px-2 py-0.5 rounded-full inline-block ${
                          onboardResult.safetyRiskStatus === "CLEAR"
                            ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                            : onboardResult.safetyRiskStatus === "WATCHLIST"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {onboardResult.safetyRiskStatus}
                      </div>
                    </div>
                  </div>

                  {/* Universal DID Box */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Universal Decentralized ID (DID)
                      </span>
                      <button
                        onClick={() => copyToClipboard(onboardResult.did)}
                        className="text-xs text-teal-400 flex items-center gap-1 hover:underline"
                      >
                        {copiedDid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedDid ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="font-mono text-xs text-slate-200 break-all select-all">
                      {onboardResult.did}
                    </div>
                  </div>

                  {/* Multi-Platform Affiliations */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Affiliated Platforms in Network ({onboardResult.affiliations.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {onboardResult.affiliations.map((aff, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-sm text-white">{aff.platformName}</div>
                            <div className="text-xs font-mono text-slate-400">{aff.platformWorkerId}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20">
                            {aff.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Cross-Platform Reviews */}
                  {onboardResult.recentReviews && onboardResult.recentReviews.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Cross-Platform Performance & Incident History ({onboardResult.recentReviews.length})
                      </h3>
                      <div className="space-y-2">
                        {onboardResult.recentReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className={`p-3 rounded-xl border ${
                              rev.flag === "WARNING"
                                ? "bg-amber-950/20 border-amber-500/30"
                                : rev.flag === "CRITICAL_INCIDENT"
                                ? "bg-red-950/20 border-red-500/30"
                                : "bg-slate-950 border-slate-800"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                <span>Reported by {rev.platformName}</span>
                                {rev.flag !== "NORMAL" && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-400 font-semibold">
                                    {rev.flag}
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {rev.rating}★
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                            <div className="text-[10px] text-slate-500 mt-1">Category: {rev.category}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href={`/worker/${encodeURIComponent(onboardResult.did)}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      <span>Open Full Worker Digital Passport</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[380px] rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-300">Awaiting Platform Request</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Fill in the form to test onboarding a driver. You can try testing with an already registered phone (e.g. 9811002233) to see how VaaS returns history across Uber, Ola, and Zomato!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LOG REVIEW / SAFETY INCIDENT */}
        {activeTab === "review" && (
          <div className="max-w-2xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              Report Review or Incident as {activePlatform}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Feedback and incident reports submitted here are instantly factored into the worker's universal Trust Score and made available to all network platforms.
            </p>

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs text-teal-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Review recorded successfully! The worker's aggregate score has been recalculated.</span>
              </div>
            )}

            {reviewError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Worker Phone Number or DID
                </label>
                <input
                  required
                  value={reviewForm.phone}
                  onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                  placeholder="e.g. 9811002233"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        reviewForm.rating >= star
                          ? "bg-amber-400/10 border-amber-400 text-amber-400"
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${reviewForm.rating >= star ? "fill-amber-400" : ""}`} />
                      <span>{star}★</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={reviewForm.category}
                  onChange={(e) => setReviewForm({ ...reviewForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="Safety & Driving">Safety & Driving</option>
                  <option value="Punctuality & Reliability">Punctuality & Reliability</option>
                  <option value="Customer Service & Politeness">Customer Service & Politeness</option>
                  <option value="Vehicle Cleanliness">Vehicle Cleanliness</option>
                  <option value="Policy Violation / Altercation">Policy Violation / Altercation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Incident Severity Flag
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "NORMAL", label: "Normal Review", color: "border-slate-700 text-slate-300" },
                    { value: "WARNING", label: "Warning Flag", color: "border-amber-500/50 text-amber-400 bg-amber-500/5" },
                    { value: "CRITICAL_INCIDENT", label: "Critical Safety Flag", color: "border-red-500/50 text-red-400 bg-red-500/5" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setReviewForm({ ...reviewForm, flag: item.value as any })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        reviewForm.flag === item.value
                          ? `${item.color} ring-2 ring-teal-400/30 font-bold`
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Comments / Incident Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Provide context regarding worker behavior, ride feedback, or incident notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {reviewLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to VaaS Network...</span>
                  </>
                ) : (
                  <span>Submit Review to VaaS Network</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: UNIVERSAL PASSPORT LOOKUP */}
        {activeTab === "lookup" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-400" />
                Universal Worker Passport Search
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Query any gig worker in the network by their 10-digit phone number or decentralized DID.
              </p>

              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter phone (e.g. 9811002233) or did:vaas:..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Inspect</span>
                </button>
              </form>

              {searchError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                  {searchError}
                </div>
              )}
            </div>

            {searchResult && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{searchResult.name}</h3>
                    <div className="text-xs text-slate-400">Phone: {searchResult.phone} &bull; Aadhaar: •••• {searchResult.aadhaarLast4}</div>
                  </div>
                  <Link
                    href={`/worker/${encodeURIComponent(searchResult.did)}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20"
                  >
                    <span>View Digital Card</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Trust Score</div>
                    <div className="text-2xl font-black text-teal-400">{searchResult.trustScore}/100</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Average Rating</div>
                    <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400" />
                      {searchResult.averageRating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Safety Status</div>
                    <div
                      className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${
                        searchResult.safetyRiskStatus === "CLEAR"
                          ? "bg-teal-500/10 text-teal-400"
                          : searchResult.safetyRiskStatus === "WATCHLIST"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {searchResult.safetyRiskStatus}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Active Affiliations ({searchResult.affiliations.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {searchResult.affiliations.map((aff, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div className="font-bold text-white">{aff.platformName}</div>
                        <div className="text-slate-400 font-mono mt-0.5">{aff.platformWorkerId} &bull; {aff.workType}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {searchResult.reviews.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Review & Incident History ({searchResult.reviews.length})
                    </h4>
                    <div className="space-y-2">
                      {searchResult.reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="font-bold text-white">{rev.platformName}</span>
                            <span className="text-amber-400 font-bold">{rev.rating}★</span>
                          </div>
                          <p className="text-slate-300 italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

