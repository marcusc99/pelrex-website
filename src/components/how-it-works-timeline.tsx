"use client";

import { PhoneCall, FileText, Cpu, Code, Rocket } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
    {
        id: 1,
        title: "Discovery Call",
        date: "Phase 1",
        content: "We analyze your lead flow, identify where prospects slip through the cracks, and determine exact workflow requirements.",
        category: "Discovery",
        icon: PhoneCall,
        relatedIds: [2],
        status: "completed" as const,
        energy: 20,
    },
    {
        id: 2,
        title: "Workflow Analysis",
        date: "Phase 2",
        content: "Deep dive into your sales pipeline to find the most impactful automation opportunities.",
        category: "Analysis",
        icon: FileText,
        relatedIds: [1, 3],
        status: "completed" as const,
        energy: 40,
    },
    {
        id: 3,
        title: "AI Architecture Design",
        date: "Phase 3",
        content: "We design a custom AI system tailored to your specific workflows and tools.",
        category: "Design",
        icon: Cpu,
        relatedIds: [2, 4],
        status: "in-progress" as const,
        energy: 60,
    },
    {
        id: 4,
        title: "Build & Deployment",
        date: "Phase 4",
        content: "Our team handles the entire implementation. You review, we refine, then we launch.",
        category: "Implementation",
        icon: Code,
        relatedIds: [3, 5],
        status: "pending" as const,
        energy: 80,
    },
    {
        id: 5,
        title: "Scale Without Hiring",
        date: "Phase 5",
        content: "Your AI agents handle the grind. You focus on high-value conversations and closing bigger deals.",
        category: "Scale",
        icon: Rocket,
        relatedIds: [4],
        status: "pending" as const,
        energy: 100,
    },
];

export function HowItWorksTimeline() {
    return (
        <div className="w-full flex justify-center">
            <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
    );
}

export default HowItWorksTimeline;
