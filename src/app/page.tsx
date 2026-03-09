"use client";
import React, { useEffect, useState } from "react";
import { HeroCanvas } from "@/components/hero-canvas";
import { LogoCloud } from "@/components/ui/logo-cloud-4";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Anthropic, Antigravity, Gemini } from '@lobehub/icons';
import Cal, { getCalApi } from "@calcom/embed-react";
import { cn } from "@/lib/utils";
import { Zap, PhoneCall, FolderSync, Repeat, Workflow, Mic } from "lucide-react";
import HowItWorksTimeline from "@/components/how-it-works-timeline";

export default function Home() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        (async function () {
            const cal = await getCalApi({ "namespace": "30min" });
            cal("ui", { "theme": "dark", "hideEventTypeDetails": false, "layout": "month_view" });
        })();

        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll(".fade-in").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <main className="relative w-full min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-end pb-[12vh] sm:pb-[15vh] overflow-hidden">
                {isClient && <HeroCanvas />}

                {/* Ambient Glow behind text */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#7C3AED] blur-[200px] opacity-15 pointer-events-none rounded-full" />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0070F3] blur-[200px] opacity-15 pointer-events-none rounded-full" />

                <div className="relative z-10 flex flex-col items-center text-center max-w-[900px] px-6 gap-3 sm:gap-6">
                    <h1 className="sr-only">Pelrex Agency</h1>

                    {/* Subtitle */}
                    <p className="text-white text-sm sm:text-xl md:text-2xl font-light leading-relaxed tracking-tight fade-in max-w-[800px]">
                        Your leads expect instant responses. Your competitors are already using AI.
                        We build intelligent voice and text agents that engage every lead in under 60 seconds
                        — while you sleep, and while you scale.
                    </p>

                    {/* CTA Button */}
                    <a
                        href="#calendly"
                        className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base md:text-lg font-bold text-white transition-all duration-500 rounded-full border-2 border-transparent bg-gradient-to-r from-[#7C3AED] to-[#0070F3] hover:scale-105 shadow-[0_0_30px_rgba(124,58,237,0.5),0_0_50px_rgba(0,112,243,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7),0_0_80px_rgba(0,112,243,0.6)] overflow-hidden fade-in animate-pulse-glow"
                    >
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />

                        {/* Inner Glow */}
                        <div className="absolute inset-[2px] bg-gradient-to-r from-[#7C3AED]/90 to-[#0070F3]/90 rounded-full" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            See How AI Can 10x Your Lead Response
                            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </a>
                </div>
            </section>

            {/* Logo Cloud Section */}
            <section className="w-full py-24 flex flex-col items-center justify-center px-6 relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="w-full max-w-5xl">
                    <h2 className="mb-12 text-center fade-in">
                        <span className="block font-medium text-xl text-zinc-500 mb-2">
                            Enterprise-Grade AI
                        </span>
                        <span className="font-bold text-2xl tracking-tight md:text-3xl text-zinc-300">
                            Powered by the World's Most Advanced Models
                        </span>
                    </h2>
                    <LogoCloud logos={logos} />
                </div>
            </section>

            {/* Outcomes Grid */}
            <section id="services" className="w-full max-w-7xl mx-auto pt-16 pb-32 px-6 relative z-10">
                <div className="text-center mb-16 fade-in">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-white">
                        Stop Losing Deals to Slow Follow-Up
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        Deploy AI agents that work 24/7 so you never miss a revenue opportunity.
                    </p>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
                    <GridItem
                        icon={<Zap className="h-5 w-5 text-[#0070F3]" />}
                        title="Instant Lead Engagement"
                        description="Respond to every inquiry in under 60 seconds—before your competitors even wake up."
                    />
                    <GridItem
                        icon={<PhoneCall className="h-5 w-5 text-[#7C3AED]" />}
                        title="AI Voice Agents"
                        description="Answer every call, qualify leads, and book meetings—even at 3 AM on Sunday."
                    />
                    <GridItem
                        icon={<FolderSync className="h-5 w-5 text-[#0070F3]" />}
                        title="Zero Manual Admin"
                        description="Automatically collect documents, update your CRM, and sync your pipeline in real-time."
                    />
                    <GridItem
                        icon={<Repeat className="h-5 w-5 text-[#7C3AED]" />}
                        title="Persistent Follow-Up"
                        description="Intelligent nurture sequences that re-engage cold leads and drive conversions."
                    />
                </ul>
            </section>

            {/* How It Works Timeline */}
            <section id="process" className="w-full max-w-5xl mx-auto pt-16 pb-4 px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-white text-center fade-in">
                    How It Works
                </h2>
                <HowItWorksTimeline />
            </section>

            {/* What To Expect */}
            <section id="expectations" className="w-full max-w-5xl mx-auto pt-8 pb-24 px-6 relative z-10">
                <div className="text-center mb-12 fade-in">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-white">
                        Every Minute Counts
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        78% of customers buy from whoever responds first. Stop hemorrhaging leads to faster competitors—deploy AI that never sleeps.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
                    {[
                        { num: "<60s", label: "Average Response Time", desc: "Engage leads instantly—while your competitors are still checking email.", color: "from-[#0070F3] to-[#00c6ff]" },
                        { num: "15+", label: "Hours Saved Per Week", desc: "Reclaim your calendar from repetitive admin work and refocus on growth.", color: "from-[#7C3AED] to-[#c084fc]" },
                        { num: "24/7", label: "Always-On Coverage", desc: "No sick days. No PTO. No burnout. Just relentless execution around the clock.", color: "from-[#10b981] to-[#34d399]" }
                    ].map((stat, i) => (
                        <div key={i} className="list-none w-full h-full min-h-[16rem] group">
                            <div className="relative h-full rounded-[1.5rem] border-[0.75px] border-white/10 p-2 md:p-3 bg-white/[0.01]">
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={2}
                                />
                                <div className="relative flex h-full flex-col items-center text-center justify-center overflow-hidden rounded-xl border-[0.75px] border-white/5 bg-black/40 backdrop-blur-md p-8 shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className={`text-6xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b ${stat.color} drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-500`}>
                                        {stat.num}
                                    </span>
                                    <span className="text-sm font-bold text-white/90 uppercase tracking-[0.2em] mb-4">
                                        {stat.label}
                                    </span>
                                    <p className="text-zinc-400 text-sm leading-relaxed max-w-[250px]">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA / Footer */}
            <footer id="calendly" className="w-full mx-auto pt-32 pb-16 px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16 fade-in">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-12 text-white">
                        Ready to Stop Losing Leads?
                    </h2>

                    <div className="glass overflow-hidden h-auto min-h-[700px] w-full max-w-[1000px] mx-auto rounded-[2rem] p-0 md:p-2 text-left border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.1)] flex items-center justify-center bg-black/50">
                        {isClient && (
                            <Cal
                                namespace="30min"
                                calLink="marcus-cupillari-3o2kga/30min"
                                style={{ width: "100%", height: "100%", minHeight: "700px" }}
                                config={{ layout: 'month_view' }}
                            />
                        )}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto flex justify-center items-center pt-8 border-t border-white/10 text-sm text-zinc-500">
                    <a href="https://linkedin.com/in/marcuscupillari" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
            </footer>

            {/* Global specific styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
          .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `
            }} />
            <style jsx global>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </main>
    );
}

// Subcomponents

interface GridItemProps {
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

function GridItem({ icon, title, description }: GridItemProps) {
    return (
        <li className="list-none w-full h-full min-h-[16rem]">
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3 bg-white/[0.01]">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-white/5 bg-black/40 backdrop-blur-md p-6 shadow-sm md:p-6">
                    <div className="relative flex flex-1 flex-col justify-start gap-4">
                        <div className="w-fit mb-2 rounded-lg border-[0.75px] border-white/10 bg-white/5 p-3 shadow-inner">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="pt-0.5 text-xl font-medium tracking-tight text-white">
                                {title}
                            </h3>
                            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

const baseLogos = [
    {
        element: <Anthropic size={64} />,
        alt: "Claude Logo",
    },
    {
        element: <Antigravity size={64} />,
        alt: "Antigravity Logo",
    },
    {
        element: <Gemini size={64} />,
        alt: "Google Gemini Logo",
    },
    {
        element: <Workflow size={64} className="text-zinc-500 hover:text-white transition-colors duration-300" strokeWidth={1.5} />,
        alt: "Make.com Logo",
    },
    {
        element: <Zap size={64} className="text-zinc-500 hover:text-[#FF4F00] transition-colors duration-300" strokeWidth={1.5} />,
        alt: "Zapier Logo",
    },
    {
        element: <Mic size={64} className="text-zinc-500 hover:text-white transition-colors duration-300" strokeWidth={1.5} />,
        alt: "ElevenLabs Logo",
    },
];

// Duplicate logos array twice to ensure the infinite slider always has enough elements to fill the screen width without gaps
const logos = [...baseLogos, ...baseLogos, ...baseLogos];
