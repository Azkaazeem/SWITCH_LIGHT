import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";

export default function LightSwitch() {
  const scrollRef = useRef(null);
  const bgRef = useRef(null);
  const stringRef = useRef(null);
  const handleRef = useRef(null);
  
  // Initial state light ON (true)
  const [isLightOn, setIsLightOn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize Locomotive Scroll
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  // Background smooth color transition
  useEffect(() => {
    gsap.to(bgRef.current, {
      backgroundColor: isLightOn ? "#f1dfb0" : "#2a3138", // Beige to Dark Slate
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, [isLightOn]);

  const toggleLight = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // 1. Pull down animation
    tl.to([stringRef.current, handleRef.current], {
      y: 40,
      duration: 0.2,
      ease: "power2.in",
    })
    // 2. Snap back with elastic effect
    .to([stringRef.current, handleRef.current], {
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      onStart: () => {
        // Toggle state exactly when the string snaps back
        setIsLightOn((prev) => !prev);
      },
    });
  };

  return (
    <div ref={scrollRef} data-scroll-container>
      {/* Background Container */}
      <div
        ref={bgRef}
        data-scroll-section
        className="relative flex min-h-screen w-full items-start justify-center overflow-hidden"
      >
        {/* Lightbulb Setup */}
        <div className="relative mt-0 flex flex-col items-center">
          
          {/* Main Wire holding the bulb */}
          <div className="h-16 w-[4px] bg-[#4a4e53]"></div>

          {/* Bulb SVG Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Bulb Base */}
            <div className="z-20 h-6 w-10 rounded-sm bg-[#848b94] border-b-2 border-[#5c6168]"></div>
            <div className="z-20 h-4 w-8 bg-[#6f757d] rounded-b-md"></div>

            {/* Glass Bulb */}
            <div
              className={`absolute top-[1.2rem] z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
                isLightOn
                  ? "bg-[#e8f192] shadow-[0_0_80px_30px_rgba(232,241,146,0.6)] border-2 border-[#cdd47c]"
                  : "bg-[#798088] shadow-none border-2 border-[#646a70]"
              }`}
            >
              {/* Inner Filament glowing effect */}
              <div
                className={`h-10 w-6 rounded-full border-2 transition-all duration-500 ${
                  isLightOn ? "border-[#fffaaf] opacity-100" : "border-[#54595e] opacity-50"
                }`}
              ></div>
            </div>
          </div>

          {/* Pullable String Area */}
          <div 
            className="absolute top-40 z-0 flex cursor-pointer flex-col items-center pb-10" 
            onClick={toggleLight}
          >
            {/* The String */}
            <div
              ref={stringRef}
              className="h-28 w-[2px] bg-[#3a3f45] origin-top"
            ></div>
            
            {/* The Handle / Knot at the end */}
            <div
              ref={handleRef}
              className="h-3 w-3 -mt-1 rounded-full bg-[#1e2327]"
            ></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}