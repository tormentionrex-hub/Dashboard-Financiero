import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from "@gsap/react";
import TopNavBar    from '../components/navigation/TopNavBar';
import SideNavBar   from '../components/navigation/SideNavBar';
import HeroSection  from '../components/dashboard/HeroSection';
import CubeSection  from '../components/dashboard/CubeSection';
import Footer       from '../components/navigation/Footer';
import backgroundVideo from '../images/backgroundVideo.mp4';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function DashboardPage() {
  const [isPlaying,   setIsPlaying]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const container = useRef();

  useGSAP(() => {
    // Hero entrance
    gsap.from('.anim-hero', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      immediateRender: false,
    });

    // Lateral scroll-progress bar
    gsap.to('.scroll-progress-bar', {
      scrollTrigger: {
        scrub: 0.5,
        start: 'top top',
        end: 'bottom bottom',
      },
      scaleY: 1,
      ease: 'none',
    });
  }, { scope: container });

  return (
    <div ref={container} className="text-white selection:bg-indigo-500/30 min-h-screen relative bg-transparent">

      {/* Cinematic background video */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <video
          src={backgroundVideo}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] z-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
      </div>

      {/* Lateral scroll-progress bar */}
      <div className="fixed right-0 top-0 w-0.5 h-full z-50 bg-white/5">
        <div
          className="scroll-progress-bar w-full bg-gradient-to-b from-indigo-500 to-cyan-400 origin-top"
          style={{ height: '100%', scaleY: 0 }}
        />
      </div>

      {/* Main structure */}
      <div className="relative z-10">
        <TopNavBar />

        <div className="flex pt-16">
          <SideNavBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

          <main className="flex-grow transition-all duration-500 min-w-0">

            {/* HERO */}
            <div className="anim-hero relative z-20 min-h-[calc(100vh-4rem)] flex flex-col justify-center px-8 md:px-16 py-12">
              <HeroSection isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
            </div>

            {/* CUBE SECTION — 3D scroll-linked gallery */}
            <CubeSection />

            {/* Footer */}
            <div className="relative z-10">
              <Footer />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
