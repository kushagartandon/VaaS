"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface CharacterProps {
  mouseX: number;
  mouseY: number;
  isClicked: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}


const MainCharacter = ({ mouseX, mouseY, isClicked, containerRef }: CharacterProps) => {
  const springConfig = { damping: 25, stiffness: 150 };
  
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const rotation = useSpring(0, { damping: 20, stiffness: 100 });
  
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (mouseX - centerX) / 15;
      const deltaY = (mouseY - centerY) / 15;
      
      x.set(deltaX);
      y.set(deltaY);
      rotation.set(deltaX / 5);
    }
  }, [mouseX, mouseY, x, y, rotation, containerRef]);

  const eyeX = useTransform(x, [-30, 30], [-4, 4]);
  const eyeY = useTransform(y, [-30, 30], [-3, 3]);

  return (
    <motion.div
      className="relative character-shadow"
      style={{ x, y, rotate: rotation }}
      animate={isClicked ? { scale: [1, 0.9, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Main body */}
      <motion.div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-character-primary to-brand-teal relative overflow-hidden">
        {/* Face container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Eyes container */}
          <div className="flex gap-4 -mt-2">
            {/* Left eye */}
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center overflow-hidden">
              <motion.div 
                className="w-4 h-4 bg-brand-dark rounded-full"
                style={{ x: eyeX, y: eyeY }}
              >
                <div className="w-1.5 h-1.5 bg-card rounded-full mt-0.5 ml-0.5" />
              </motion.div>
            </div>
            {/* Right eye */}
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center overflow-hidden">
              <motion.div 
                className="w-4 h-4 bg-brand-dark rounded-full"
                style={{ x: eyeX, y: eyeY }}
              >
                <div className="w-1.5 h-1.5 bg-card rounded-full mt-0.5 ml-0.5" />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Mouth */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={isClicked ? { scaleY: 1.5, scaleX: 1.2 } : {}}
        >
          <div className="w-8 h-3 bg-brand-dark rounded-full" />
        </motion.div>

        {/* Shine effect */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
      </motion.div>

      {/* Antenna */}
      <motion.div 
        className="absolute -top-6 left-1/2 -translate-x-1/2"
        animate={{ rotate: isClicked ? [0, -20, 20, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-1 h-8 bg-character-primary rounded-full" />
        <div className="w-4 h-4 bg-character-secondary rounded-full -mt-1 -ml-1.5 shadow-lg" />
      </motion.div>

      {/* Arms */}
      <motion.div 
        className="absolute -left-4 top-1/2 -translate-y-1/2"
        animate={isClicked ? { rotate: -30, y: -10 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-6 h-3 bg-character-primary rounded-full" />
      </motion.div>
      <motion.div 
        className="absolute -right-4 top-1/2 -translate-y-1/2"
        animate={isClicked ? { rotate: 30, y: -10 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-6 h-3 bg-character-primary rounded-full" />
      </motion.div>
    </motion.div>
  );
};

const FloatingOrb = ({ delay, size, color, baseX, baseY, mouseX, mouseY }: {
  delay: number;
  size: number;
  color: string;
  baseX: number;
  baseY: number;
  mouseX: number;
  mouseY: number;
}) => {
  const springConfig = { damping: 30, stiffness: 80 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const deltaX = (mouseX - 200) / 30;
    const deltaY = (mouseY - 250) / 30;
    x.set(deltaX);
    y.set(deltaY);
  }, [mouseX, mouseY, x, y]);

  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-80`}
      style={{ 
        width: size, 
        height: size, 
        left: baseX, 
        top: baseY,
        x,
        y,
      }}
      animate={{ 
        y: [0, -15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const SmallCharacter = ({ mouseX, mouseY, isClicked, position }: {
  mouseX: number;
  mouseY: number;
  isClicked: boolean;
  position: { x: number; y: number };
}) => {
  const springConfig = { damping: 35, stiffness: 100 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const deltaX = (mouseX - 200) / 25;
    const deltaY = (mouseY - 250) / 25;
    x.set(deltaX);
    y.set(deltaY);
  }, [mouseX, mouseY, x, y]);

  const eyeX = useTransform(x, [-20, 20], [-2, 2]);
  const eyeY = useTransform(y, [-20, 20], [-2, 2]);

  return (
    <motion.div
      className="absolute character-shadow"
      style={{ left: position.x, top: position.y, x, y }}
      animate={isClicked ? { scale: [1, 1.2, 0.9, 1], rotate: [0, 10, -10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-character-secondary to-yellow-400 relative">
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-card rounded-full flex items-center justify-center">
            <motion.div 
              className="w-2 h-2 bg-brand-dark rounded-full"
              style={{ x: eyeX, y: eyeY }}
            />
          </div>
          <div className="w-4 h-4 bg-card rounded-full flex items-center justify-center">
            <motion.div 
              className="w-2 h-2 bg-brand-dark rounded-full"
              style={{ x: eyeX, y: eyeY }}
            />
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-brand-dark rounded-full" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-white/40 rounded-full" />
      </div>
    </motion.div>
  );
};

const ThirdCharacter = ({ mouseX, mouseY, isClicked, position }: {
  mouseX: number;
  mouseY: number;
  isClicked: boolean;
  position: { x: number; y: number };
}) => {
  const springConfig = { damping: 40, stiffness: 90 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const deltaX = (mouseX - 200) / 20;
    const deltaY = (mouseY - 250) / 20;
    x.set(deltaX);
    y.set(deltaY);
  }, [mouseX, mouseY, x, y]);

  return (
    <motion.div
      className="absolute character-shadow"
      style={{ left: position.x, top: position.y, x, y }}
      animate={isClicked ? { y: [0, -20, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-character-accent to-purple-400 relative">
        <div className="absolute inset-0 flex items-center justify-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-card rounded-full" />
          <div className="w-2.5 h-2.5 bg-card rounded-full" />
        </div>
        <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white/40 rounded-full" />
      </div>
    </motion.div>
  );
};

export default function InteractiveCharacters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 200, y: 250 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 400);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("click", handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-pointer"
    >
      {/* Background particles */}
      <FloatingOrb delay={0} size={60} color="bg-brand-teal/20" baseX={50} baseY={100} mouseX={mousePosition.x} mouseY={mousePosition.y} />
      <FloatingOrb delay={0.5} size={40} color="bg-character-secondary/20" baseX={280} baseY={80} mouseX={mousePosition.x} mouseY={mousePosition.y} />
      <FloatingOrb delay={1} size={30} color="bg-character-accent/20" baseX={320} baseY={350} mouseX={mousePosition.x} mouseY={mousePosition.y} />
      <FloatingOrb delay={1.5} size={50} color="bg-brand-teal/15" baseX={80} baseY={380} mouseX={mousePosition.x} mouseY={mousePosition.y} />
      <FloatingOrb delay={2} size={25} color="bg-character-secondary/25" baseX={200} baseY={450} mouseX={mousePosition.x} mouseY={mousePosition.y} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--brand-teal)) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Characters */}
      <div className="absolute inset-0 flex items-center justify-center">
        <MainCharacter 
          mouseX={mousePosition.x} 
          mouseY={mousePosition.y} 
          isClicked={isClicked}
          containerRef={containerRef}
        />
      </div>

      <SmallCharacter 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isClicked={isClicked}
        position={{ x: 60, y: 150 }}
      />

      <SmallCharacter 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isClicked={isClicked}
        position={{ x: 300, y: 320 }}
      />

      <ThirdCharacter 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isClicked={isClicked}
        position={{ x: 280, y: 150 }}
      />

      <ThirdCharacter 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isClicked={isClicked}
        position={{ x: 100, y: 350 }}
      />

      {/* Click hint */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-card/60 text-xs font-medium"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Click to interact ✨
      </motion.div>
    </div>
  );
}