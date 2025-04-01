"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4 relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
            Manage Your Money Better
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Manage Your Finances <br /> with Intelligence
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300"
            >
              Get Started
            </Button>
          </Link>
          <Link href="https://www.youtube.com/roadsidecoder">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300 border-2"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-lg transform rotate-1"></div>
          <div ref={imageRef} className="hero-image relative transform hover:scale-[1.02] transition-transform duration-500">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
