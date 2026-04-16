import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";

export default function LightSwitch() {
  const scrollRef = useRef(null);
  const bgRef = useRef(null);
  const pathRef = useRef(null);
  const handleRef = useRef(null);

  const [isLightOn, setIsLightOn] = useState(true);
  
  const isDragging = useRef(false);
  const startY = useRef(0);
  const ropeState = useRef({
    cpx: 50,
    cpy: 60,
    ey: 120, 
  });

  useEffect(() => {
    gsap.to(bgRef.current, {
      backgroundColor: isLightOn ? "#f1dfb0" : "#2a3138",
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, [isLightOn]);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
    });
    return () => scroll && scroll.destroy();
  }, []);

  const updateRope = () => {
    const { cpx, cpy, ey } = ropeState.current;
    if (pathRef.current) {

      pathRef.current.setAttribute("d", `M 50 0 Q ${cpx} ${cpy} 50 ${ey}`);
    }
    if (handleRef.current) {
      gsap.set(handleRef.current, { y: ey });
    }
  };

  useEffect(() => {
    updateRope();
  }, []);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY - ropeState.current.ey;
    gsap.killTweensOf(ropeState.current);
    document.body.style.userSelect = "none";
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    let newY = e.clientY - startY.current;
    
    if (newY < 120) newY = 120;
    if (newY > 260) newY = 260 + (newY - 260) * 0.2; 

    ropeState.current.ey = newY;
    ropeState.current.cpy = newY / 2;
    ropeState.current.cpx = 50;
    updateRope();
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.userSelect = "auto";

    const pullDistance = ropeState.current.ey;

    if (pullDistance > 180) {
      setIsLightOn((prev) => !prev);
    }

    gsap.to(ropeState.current, {
      ey: 120,
      cpy: 60,
      cpx: 50,
      duration: 1.5,
      ease: "elastic.out(1, 0.2)",
      onUpdate: updateRope,
    });

    const waveForce = pullDistance > 150 ? 20 : 40; 
    
    gsap.fromTo(
      ropeState.current,
      { cpx: waveForce },
      {
        cpx: 50,
        duration: 2,
        ease: "elastic.out(1, 0.1)",
        onUpdate: updateRope,
      }
    );
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      <div
        ref={bgRef}
        data-scroll-section
        className="relative flex min-h-screen w-full items-start justify-center overflow-hidden"
      >
        <div className="relative mt-0 flex flex-col items-center">
          
          <div className="h-16 w-[4px] bg-[#4a4e53]"></div>

          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            <div className="z-20 h-6 w-10 rounded-sm bg-[#848b94] border-b-2 border-[#5c6168]"></div>
            <div className="z-20 h-4 w-8 bg-[#6f757d] rounded-b-md"></div>

            <div
              className={`absolute top-[1.2rem] z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${
                isLightOn
                  ? "bg-[#e8f192] shadow-[0_0_80px_30px_rgba(232,241,146,0.6)] border-2 border-[#cdd47c]"
                  : "bg-[#798088] shadow-none border-2 border-[#646a70]"
              }`}
            >
              <div
                className={`h-10 w-6 rounded-full border-2 transition-all duration-300 ${
                  isLightOn ? "border-[#fffaaf] opacity-100" : "border-[#54595e] opacity-50"
                }`}
              ></div>
            </div>
          </div>

          <div className="absolute top-[8.5rem] z-20 flex flex-col items-center">
            <svg width="100" height="300" className="overflow-visible absolute top-0">

              <path
                ref={pathRef}
                stroke="#3a3f45"
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"
              />

              <rect
                x="30"
                y="0"
                width="40"
                height="300"
                fill="transparent"
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
              />
            </svg>

            <div
              ref={handleRef}
              onPointerDown={handlePointerDown}
              className="absolute left-1/2 h-4 w-4 -ml-2 rounded-full bg-[#1e2327] cursor-grab active:cursor-grabbing"
            ></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}