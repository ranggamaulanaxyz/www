import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const technologies = [
  { name: "Odoo", logo: "/tech-logos/odoo.svg" },
  { name: "React", logo: "/tech-logos/react.svg" },
  { name: "React Router", logo: "/tech-logos/react-router.svg" },
  { name: "Cloudflare", logo: "/tech-logos/cloudflare.svg" },
  { name: "Supabase", logo: "/tech-logos/supabase.svg" },
  { name: "PostgreSQL", logo: "/tech-logos/postgresql.svg" },
  { name: "Ubuntu", logo: "/tech-logos/ubuntu.svg" },
  { name: "ERPNext", logo: "/tech-logos/erpnext.svg" },
  { name: "Laravel", logo: "/tech-logos/laravel.svg" },
  { name: "WordPress", logo: "/tech-logos/wordpress.svg" },
  { name: "Node.js", logo: "/tech-logos/nodejs.svg" },
  { name: "TypeScript", logo: "/tech-logos/typescript.svg" },
  { name: "PHP", logo: "/tech-logos/php.svg" },
  { name: "Python", logo: "/tech-logos/python.svg" },
];

export default function TechStackCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      Autoplay({
        delay: 1800,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    ],
  );

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    emblaApi.plugins().autoplay?.play();

    return () => emblaApi.plugins().autoplay?.stop();
  }, [emblaApi]);

  return (
    <div className="container mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-3 flex">
          {technologies.map((technology) => (
            <div key={technology.name} className="flex-none pl-3">
              <div className="flex w-fit items-center justify-center gap-3 rounded-lg px-4 transition-colors">
                <img
                  src={technology.logo}
                  alt=""
                  aria-hidden="true"
                  className="size-8 shrink-0 object-contain opacity-70 grayscale transition-[filter,opacity] hover:opacity-100 hover:grayscale-0 md:size-9"
                />
                <span className="text-foreground/80 text-sm font-medium whitespace-nowrap md:text-base">
                  {technology.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
