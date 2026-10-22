"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { bloodGroups, districts } from "@/components/geoData";
import { qs } from "@/lib/api";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";

const slides = [
  {
    title: "One donation can give a patient another tomorrow",
    text: "Thousands of families in Bangladesh search for blood every week. Join a community of voluntary donors who answer within hours.",
    image: "/images/community.svg",
    alt: "Donors gathered around a blood drop",
  },
  {
    title: "Find a matching donor near the hospital",
    text: "Filter by blood group, district and upazila to reach verified donors who are ready to help right now.",
    image: "/images/bag.svg",
    alt: "Blood bag illustration",
  },
  {
    title: "Post a request and let the community respond",
    text: "Share the hospital, date and units needed. Donors accept the request, and you follow every step from your dashboard.",
    image: "/images/ambulance.svg",
    alt: "Ambulance illustration",
  },
];

export default function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState({ bloodGroup: "", district: "" });

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (next) => setIndex((next + slides.length) % slides.length);

  const handleSearch = (event) => {
    event.preventDefault();
    router.push(`/search?${qs(search)}`);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="SaveBlood highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white lg:h-[70vh] lg:min-h-[520px] lg:max-h-[680px]"
    >
      <div className="container-page relative grid h-full items-center gap-8 py-10 lg:grid-cols-2 lg:py-0">
        <div className="relative min-h-[300px] sm:min-h-[260px]">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
              className={cn(
                "transition-opacity duration-500",
                i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
              )}
            >
              <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Voluntary blood donation network
              </p>
              {i === 0 ? (
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
              ) : (
                <p className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</p>
              )}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-red-50/90">{slide.text}</p>
            </div>
          ))}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/register" size="lg" className="bg-white !text-brand-700 hover:!bg-brand-50">
              Donate Blood
            </Button>
            <Button href="/dashboard/requests/create" size="lg" className="border border-white/60 bg-transparent hover:bg-white/10">
              Request Blood
            </Button>
          </div>

          <form
            onSubmit={handleSearch}
            aria-label="Quick donor search"
            className="mt-6 grid gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur sm:grid-cols-[1fr_1fr_auto]"
          >
            <Select
              aria-label="Blood group"
              placeholder="Blood group"
              options={bloodGroups}
              value={search.bloodGroup}
              onChange={(e) => setSearch((s) => ({ ...s, bloodGroup: e.target.value }))}
            />
            <Select
              aria-label="District"
              placeholder="District"
              options={districts}
              value={search.district}
              onChange={(e) => setSearch((s) => ({ ...s, district: e.target.value }))}
            />
            <Button type="submit" className="bg-amber-400 !text-slate-900 hover:!bg-amber-300">
              <Search className="size-4" aria-hidden="true" />
              Find donors
            </Button>
          </form>
        </div>

        <div className="relative hidden h-full items-center justify-center lg:flex">
          <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            {slides.map((slide, i) => (
              <Image
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 512px, 0px"
                className={cn("object-cover transition-opacity duration-500", i === index ? "opacity-100" : "opacity-0")}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="focus-ring rounded-full bg-white/15 p-2 hover:bg-white/25">
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-8 bg-white" : "w-2 bg-white/50")}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="focus-ring rounded-full bg-white/15 p-2 hover:bg-white/25">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
