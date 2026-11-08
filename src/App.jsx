import { useEffect, useRef, useState } from 'react';
import './css/style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Refresh par hamesha top se start ho:
// ScrollTrigger apni scroll memory se purani position restore karta hai, usay band karo
// ('manual' browser ki scrollRestoration bhi manual kar deta hai)
ScrollTrigger.clearScrollMemory('manual');
if (typeof window !== 'undefined') window.scrollTo(0, 0);

// Section 3 data
const celebrations = [
  {
    key: 'barat',
    title: 'BARAT',
    day: 'Sunday',
    date: '29',
    month: 'Nov 2026',
    time: '7:00 PM Onwards',
    venue: 'Jiyo Banquet Hall',
    address: 'Taragarh Road in Shahdara Town, Shahdara, Lahore',
    link: 'https://www.google.com/maps/search/?api=1&query=Jiyo+Banquet+Hall+Taragarh+Road+Shahdara+Town+Lahore',
  },
  {
    key: 'walima',
    title: 'WALIMA',
    day: 'Monday',
    date: '30',
    month: 'Nov 2026',
    time: '8:00 PM Onwards',
    venue: 'Sardar Banquet Hall',
    address: 'Outfall Rd, St Nagar, Lahore',
    link: 'https://www.google.com/maps/search/?api=1&query=Sardar+Banquet+Hall+Outfall+Rd+St+Nagar+Lahore',
  },
];

// Jin images ko pehle load karna hai (cache mein aa jayen)
const imagesToPreload = [
  '/images/a.png',
  '/images/stamp-1.png',
  '/images/left.png',
  '/images/frame1.jpg',
];

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

function App() {
  const [flap, setflap] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const container = useRef(null);

  // Refs
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftFlap = useRef(null);
  const rightFlap = useRef(null);
  const stampBtnRef = useRef(null);
  const radarPulsesRef = useRef([]);
  const cardContentRef = useRef(null);

  // Section 2 Refs for ScrollTrigger Animations
  const topFlowerRef = useRef(null);
  const bottomFlowerRef = useRef(null);
  const familyContentRef = useRef(null);

  // Saari images preload karo; sab aa jayen to loader hata do
  useEffect(() => {
    let count = 0;
    const done = () => {
      count += 1;
      setProgress(Math.round((count / imagesToPreload.length) * 100));
      if (count === imagesToPreload.length) setLoaded(true);
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done; // image fail ho jaye tab bhi loader atke nahi
      img.src = src;
    });
  }, []);

  // Images aane ke baad layout final hota hai, isliye ScrollTrigger refresh
  useEffect(() => {
    if (loaded) {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
  }, [loaded]);

  // Jab tak card open (flap) nahi hota, page scroll lock rahega
  useEffect(() => {
    if (!flap) {
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      ScrollTrigger.refresh();
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [flap]);

  useEffect(() => {
    // scrollRestoration window par nahi, window.history par hota hai
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Page band/refresh hone se pehle top par le jao, taake browser top hi restore kare
    const goTop = () => window.scrollTo(0, 0);
    window.addEventListener('beforeunload', goTop);
    window.addEventListener('pageshow', goTop);
    return () => {
      window.removeEventListener('beforeunload', goTop);
      window.removeEventListener('pageshow', goTop);
    };
  }, []);

  useGSAP(() => {
    // 1. Radar pulse infinite animation
    const pulses = radarPulsesRef.current;
    const pulseTween = gsap.to(pulses, {
      scale: 2.2,
      opacity: 0,
      duration: 2,
      repeat: -1,
      stagger: 0.6,
      ease: 'power1.out',
    });

    // 2. Stamp glow animation
    const glowTween = gsap.to('.stamp-seal', {
      boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.easeInOut'
    });

    // 3. Section 2 ScrollTrigger Reveal Animation
    gsap.fromTo(
      [topFlowerRef.current, bottomFlowerRef.current],
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#families-section',
          start: 'top center',
          toggleActions: 'play none none reverse',
        }
      }
    );

    gsap.fromTo(
      familyContentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#families-section',
          start: 'top center',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // 4. Section 3 Celebration Cards
    // Har card apne scroll position par alag reveal hota hai:
    // 3D tilt-up entrance -> content stagger -> date count-up -> looping gold shine
    gsap.utils.toArray('.celeb-card').forEach((card) => {
      const items = card.querySelectorAll('.reveal-item');
      const num = card.querySelector('.date-num');
      const target = Number(num.dataset.value);
      const counter = { v: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        card,
        { opacity: 0, y: 90, rotateX: -28, scale: 0.88, transformPerspective: 900, transformOrigin: '50% 100%' },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }
      )
        .from(items, { opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.6')
        .to(
          counter,
          {
            v: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              num.textContent = Math.round(counter.v);
            },
          },
          '<'
        );
    });

    // Gold shine sweep (loop) - har card par thora delay ke saath
    gsap.utils.toArray('.card-shine').forEach((shine, i) => {
      gsap.fromTo(
        shine,
        { xPercent: 0 },
        {
          xPercent: 600,
          duration: 1.6,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 3.5,
          delay: 1.5 + i * 1.2,
        }
      );
    });

    // Chhota floating star on top of each arch
    gsap.to('.card-star', {
      y: -4,
      scale: 1.15,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.4,
    });

    return () => {
      pulseTween.kill();
      glowTween.kill();
    };
  }, { scope: container });

  // Handle Unboxing / Opening Animation
  const handleOpen = () => {
    if (flap) return;
    setflap(true);

    const tl = gsap.timeline();

    tl.to(stampBtnRef.current, {
      y: -180,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'power2.in',
      onStart: () => {
        gsap.to(radarPulsesRef.current, { opacity: 0, duration: 0.2 });
      }
    })
    .to([leftRef.current, rightRef.current], {
      opacity: 0,
      duration: 0.4,
      ease: 'power1.out'
    }, "<")
    .to(leftFlap.current, {
      x: -300,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, "-=0.3")
    .to(rightFlap.current, {
      x: 300,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, "<")
    .to(cardContentRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    }, "-=0.4");
  };

  return (
    <div ref={container} className='min-h-screen bg-[#CFCECA] w-full overflow-x-hidden'>
      {/* Loading screen: images load hone tak */}
      <div
        className={`fixed inset-0 z-[100] bg-[#F4EFEB] flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <span className="text-[#D4AF37] text-3xl animate-pulse">✦</span>
        <p className="font-serif italic text-amber-900 text-lg tracking-wide">Loading Invitation...</p>
        <div className="w-40 h-[3px] bg-[#D4AF37]/25 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[10px] tracking-[0.3em] text-[#7E5C38] font-semibold">{progress}%</span>
      </div>

      {/* Background song: stamp par click (user interaction) ke baad start hota hai */}
      {flap && (
        <iframe
          src="https://www.youtube.com/embed/RpE-hVumiDI?autoplay=1&loop=1&playlist=RpE-hVumiDI"
          allow="autoplay"
          title="Background Audio"
          id="bg-audio"
          style={{ position: 'fixed', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', border: 0 }}
        ></iframe>
      )}

      {/* SECTION 1: HERO & ENVELOPE CARD */}
      <section className='min-h-screen flex flex-col justify-center items-center py-6 px-4 w-full relative'>
        <div className='flex flex-col justify-center items-center gap-4 w-full max-w-md'>
          <h1 className='text-center font-serif text-amber-900 italic text-xl tracking-wide'>
            Invitation Card
          </h1>

          <div className='w-[95%] max-w-[400px] h-[600px] shadow-2xl relative overflow-hidden rounded-md flex items-center justify-center bg-[#F4EFEB]'>
            
            {/* Inside Card Background & Text */}
            <div 
              ref={cardContentRef} 
              className="absolute inset-0 bg-[url('/images/frame1.jpg')] bg-cover bg-no-repeat bg-center opacity-0 scale-95 flex flex-col items-center justify-between pt-16 pb-10 px-8 text-center z-0"
            >
              <div className="mt-14">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#7E5C38] font-semibold">The Wedding Celebration</span>
              </div>

              <div className="space-y-3 my-auto w-full">
                <p className='text-xs text-[#5C4532] italic font-serif'>You are cordially invited to celebrate the union of</p>
                <div className="text-2xl font-serif font-bold text-[#2C1D12] tracking-wide flex items-center justify-center gap-3">
                  <span>Mohsin</span> 
                  <span className="text-[#A37B4C] font-light italic text-xl">&amp;</span> 
                  <span>Iqra</span>
                </div>
                <div className="w-16 h-[1px] bg-[#A37B4C]/40 mx-auto my-3"></div>
                <div className="space-y-1">
                  <p className='text-xs text-[#4A3B2C] tracking-widest uppercase font-semibold'>
                    29 – 30 November 2026
                  </p>
                </div>
              </div>

              <div className="mb-1">
                <p className='text-[11px] text-[#7E5C38] italic font-serif'>
                  Your presence will make our day complete.
                </p>
              </div>
            </div>

            {/* Left Flap */}
            <div ref={leftFlap} className='absolute w-[70px] bg-[#F4EFEB] shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-full rounded-l rounded-[30px] left-0 z-10'></div>

            {/* Right Flap */}
            <div ref={rightFlap} className='absolute w-[70px] bg-[#F4EFEB] shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-full rounded-r rounded-[30px] right-0 z-10'></div>

            {/* Left Pattern */}
            <div ref={leftRef} className='absolute top-[calc(50%-10px)] left-0 -translate-y-1/2 w-[150px] rotate-[180deg] z-10 pointer-events-none'>
              <img src="/images/a.png" alt="Pattern Left" className="w-full h-auto block" />
            </div>

            {/* Right Pattern */}
            <div ref={rightRef} className='absolute top-[calc(50%-10px)] right-0 -translate-y-1/2 w-[150px] z-10 pointer-events-none'>
              <img src="/images/a.png" alt="Pattern Right" className="w-full h-auto block" />
            </div>

            {/* Interactive Stamp Button */}
            <button
              ref={stampBtnRef}
              onClick={handleOpen}
              className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 cursor-pointer bg-transparent border-none'
            >
              <span ref={el => radarPulsesRef.current[0] = el} className="radar-pulse absolute w-[90px] h-[90px] rounded-full border-2 border-amber-600/60 opacity-80 pointer-events-none translate-y-[-10px]"></span>
              <span ref={el => radarPulsesRef.current[1] = el} className="radar-pulse absolute w-[90px] h-[90px] rounded-full border-2 border-amber-500/60 opacity-80 pointer-events-none translate-y-[-10px]"></span>
              <span ref={el => radarPulsesRef.current[2] = el} className="radar-pulse absolute w-[90px] h-[90px] rounded-full border-2 border-amber-400/50 opacity-80 pointer-events-none translate-y-[-10px]"></span>

              <img
                src="/images/stamp-1.png"
                className='stamp-seal w-[100px] h-[100px] rounded-full object-cover relative z-10 shadow-lg translate-y-[-10px]'
                alt="Stamp Seal"
              />
            </button>

          </div>

          {/* Scroll Down Indicator */}
          {flap && (
            <div className="mt-4 flex flex-col items-center animate-bounce">
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-900 font-sans font-semibold">
                Scroll Down
              </span>
              <span className="text-lg text-amber-900 mt-1">↓</span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: THE FAMILIES */}
      <section id="families-section" className='min-h-screen w-full relative flex flex-col justify-center items-center px-4 py-16 bg-[#F4EFEB] overflow-hidden'>
        <div ref={topFlowerRef} className='absolute top-0 right-0 w-[180px] sm:w-[220px] md:w-[280px] opacity-0 pointer-events-none z-10'>
          <img src="/images/left.png" className="w-full h-full object-contain rotate-180" alt="Corner Flower Top" />
        </div>

        <div ref={bottomFlowerRef} className='absolute bottom-0 left-0 w-[180px] sm:w-[220px] md:w-[280px] opacity-0 pointer-events-none z-10'>
          <img src="/images/left.png" className="w-full h-full object-contain" alt="Corner Flower Bottom" />
        </div>

        <div ref={familyContentRef} className="w-full max-w-sm flex flex-col items-center text-center gap-5 z-20 opacity-0">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7E5C38] font-semibold">THE FAMILIES</span>
          
          <div className="space-y-6 w-full">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[#2C1D12] font-medium tracking-wide">Mohsin</h3>
              <p className="text-[11px] text-[#7E5C38] uppercase tracking-widest font-semibold">Son of</p>
              <p className="text-xs text-slate-700 font-serif">Mr. Muhammad Islam & Mrs. Rehana Kosar</p>
            </div>

            <div className="text-amber-700/60 font-serif italic text-lg">&amp;</div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[#2C1D12] font-medium tracking-wide">Iqra</h3>
              <p className="text-[11px] text-[#7E5C38] uppercase tracking-widest font-semibold">Daughter of</p>
              <p className="text-xs text-slate-700 font-serif">Mr. Shokat & Mrs. Nusrat</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE CELEBRATIONS (BARAT & WALIMA CARDS) */}
      <section id="celebrations-section" className='min-h-screen w-full relative flex flex-col justify-center items-center px-4 py-16 bg-[#F4EFEB] overflow-hidden gap-10'>
        
        {/* Section Header */}
        <div className="text-center z-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7E5C38] font-semibold">SCHEDULE & VENUES</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1D12] mt-1">The Celebrations</h2>
          <div className="w-12 h-[1px] bg-[#A37B4C]/50 mx-auto mt-2"></div>
        </div>

        {/* Cards Container */}
        <div className="w-full max-w-md flex flex-col gap-10 z-20 items-center">
          {celebrations.map((c) => (
            <div key={c.key} className="celeb-card w-[95%] max-w-[360px] relative opacity-0">
              {/* Gold gradient frame */}
              <div className="rounded-t-[140px] rounded-b-3xl p-[3px] bg-gradient-to-b from-[#D4AF37] via-[#F3E2A9] to-[#B8860B] shadow-[0_20px_50px_rgba(90,62,43,0.28)]">
                {/* Card body */}
                <div className="relative overflow-hidden rounded-t-[137px] rounded-b-[21px] bg-gradient-to-b from-[#FFFDF8] to-[#F8F0E3] px-6 pt-12 pb-7 text-center flex flex-col items-center min-h-[440px]">
                  
                  {/* Thin inner border */}
                  <div className="absolute inset-2 rounded-t-[130px] rounded-b-2xl border border-[#D4AF37]/40 pointer-events-none"></div>

                  {/* Moving shine */}
                  <div className="card-shine pointer-events-none absolute top-0 -left-1/2 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent z-10"></div>

                  {/* Top: star + title */}
                  <div className="reveal-item flex flex-col items-center gap-2">
                    <span className="card-star text-[#D4AF37] text-base leading-none">✦</span>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-[#7E5C38] font-semibold">{c.title}</span>
                  </div>

                  {/* Date */}
                  <div className="reveal-item mt-4 flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500 font-medium">{c.day}</span>
                    <span
                      data-value={c.date}
                      className="date-num text-7xl font-serif font-bold leading-none my-1 bg-gradient-to-b from-[#C9A227] to-[#7E5C38] bg-clip-text text-transparent"
                    >
                      {c.date}
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em] text-gray-500 font-medium">{c.month}</span>
                  </div>

                  {/* Ornament divider */}
                  <div className="reveal-item flex items-center gap-2 my-5 w-full px-6">
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></span>
                    <span className="text-[#D4AF37] text-[10px]">◆</span>
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/60"></span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 w-full">
                    <p className="reveal-item flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900">
                      <ClockIcon />
                      {c.time}
                    </p>
                    <h3 className="reveal-item font-serif font-bold text-xl text-[#2C1D12]">{c.venue}</h3>
                    <p className="reveal-item flex items-start justify-center gap-1.5 text-[11px] text-slate-600 px-4 leading-relaxed">
                      <span className="mt-[2px] text-[#A37B4C] shrink-0"><PinIcon /></span>
                      <span>{c.address}</span>
                    </p>
                  </div>

                  {/* Button */}
                  <div className="reveal-item w-full mt-auto pt-6 relative z-20">
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full py-2.5 px-4 bg-gradient-to-r from-[#5A3E2B] to-[#7E5C38] text-white text-xs uppercase tracking-widest rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-sans font-medium text-center"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className='w-full relative overflow-hidden bg-[#F4EFEB] border-t border-[#D4AF37]/40 px-4 py-20 flex flex-col items-center text-center'>
        <div className='absolute top-0 right-0 w-[130px] sm:w-[180px] md:w-[220px] pointer-events-none'>
          <img src="/images/left.png" className="w-full h-full object-contain rotate-180" alt="Corner Flower Top" />
        </div>

        <div className='absolute bottom-0 left-0 w-[130px] sm:w-[180px] md:w-[220px] pointer-events-none'>
          <img src="/images/left.png" className="w-full h-full object-contain" alt="Corner Flower Bottom" />
        </div>

        <div className="relative z-20 flex flex-col items-center gap-3">
          <span className="text-[#D4AF37] text-base leading-none">✦</span>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7E5C38] font-semibold">
            Designed by
          </p>
          <p className="font-serif text-lg text-[#2C1D12] font-medium tracking-wide -mt-2">Muhammad Bilal</p>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7E5C38] font-semibold mt-2">
            Developed by
          </p>
          <p className="font-serif text-lg text-[#2C1D12] font-medium tracking-wide -mt-2">Muhammad Bilal</p>

          <div className="w-12 h-[1px] bg-[#A37B4C]/50 my-2"></div>

          <a
            href="https://www.instagram.com/bilal.env0/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#5A3E2B] hover:text-[#2C1D12] transition-colors font-sans font-medium tracking-wide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
            @bilal.env0
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;