import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

type Logo = {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    element?: React.ReactNode;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
    return (
        <div className="relative mx-auto my-12 max-w-5xl py-6 md:border-x border-white/5">
            <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-white/5" />

            <InfiniteSlider gap={42} reverse speed={60} speedOnHover={20}>
                {logos.map((logo, index) => (
                    logo.element ? (
                        <div key={`logo-el-${index}`} className="flex items-center justify-center opacity-70 dark:text-white">
                            {logo.element}
                        </div>
                    ) : (
                        <img
                            alt={logo.alt}
                            className="pointer-events-none h-6 select-none md:h-8 dark:brightness-0 dark:invert opacity-70"
                            height="auto"
                            key={`logo-${logo.alt || index}`}
                            loading="lazy"
                            src={logo.src}
                            width="auto"
                        />
                    )
                ))}
            </InfiniteSlider>

            <ProgressiveBlur
                blurIntensity={1}
                className="pointer-events-none absolute top-0 left-0 h-full w-[160px]"
                direction="left"
            />
            <ProgressiveBlur
                blurIntensity={1}
                className="pointer-events-none absolute top-0 right-0 h-full w-[160px]"
                direction="right"
            />

            <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-white/5" />
        </div>
    );
}
