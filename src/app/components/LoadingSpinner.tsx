import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  color?: string | "primary" | "light" | "dark" | "ai-gradient";
  speed?: "slow" | "normal" | "fast" | "ultra" | number;
  style?: "classic" | "futuristic" | "holographic" | "neon" | "particle";
  withText?: boolean | string;
  textPosition?: "top" | "bottom" | "left" | "right";
  aiMode?: boolean;
  pulseEffect?: boolean;
  trailEffect?: boolean;
  trailLength?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
  size = "md",
  color = "ai-gradient",
  speed = "normal",
  style = "futuristic",
  withText = false,
  textPosition = "bottom",
  aiMode = true,
  pulseEffect = true,
  trailEffect = true,
  trailLength = 4,
}) => {
  const controls = useAnimation();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  // Size calculations
  const sizeValue =
    typeof size === "number"
      ? size
      : {
          xs: 16,
          sm: 24,
          md: 32,
          lg: 48,
          xl: 64,
        }[size] || 32;

  // Speed calculations
  const speedValue =
    typeof speed === "number"
      ? speed
      : {
          slow: 2,
          normal: 1,
          fast: 0.6,
          ultra: 0.3,
        }[speed] || 1;

  // Color definitions
  const colorValue =
    color === "ai-gradient"
      ? "var(--ai-gradient)"
      : color === "primary"
      ? "var(--brand-brown)"
      : color === "light"
      ? "var(--brand-off-white)"
      : color === "dark"
      ? "var(--brand-dark)"
      : color;

  // Generate particles for particle style
  useEffect(() => {
    if (style === "particle" && containerRef.current) {
      const newParticles = [];
      const containerSize = sizeValue * 1.5;

      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * containerSize - containerSize / 2,
          y: Math.random() * containerSize - containerSize / 2,
          size: Math.random() * 3 + 1,
        });
      }

      setParticles(newParticles);
    }
  }, [sizeValue, style]);

  // Animation sequences
  useEffect(() => {
    if (pulseEffect) {
      const sequence = async () => {
        while (true) {
          await controls.start({
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
            transition: { duration: 2 * speedValue, repeat: Infinity },
          });
        }
      };
      sequence();
    }
  }, [controls, pulseEffect, speedValue]);

  // Trail effect
  const TrailElements = trailEffect ? (
    <AnimatePresence>
      {[...Array(trailLength)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border-2 border-transparent`}
          style={{
            width: sizeValue,
            height: sizeValue,
            borderTopColor: colorValue,
            borderTopWidth: sizeValue / 8,
            opacity: 1 - (i + 1) / (trailLength + 1),
          }}
          animate={{
            rotate: (360 * (i + 1)) / trailLength,
          }}
          transition={{
            rotate: {
              duration: (speedValue * (trailLength - i)) / trailLength,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}
    </AnimatePresence>
  ) : null;

  // Text content
  const loadingText =
    typeof withText === "string" ? withText : "Initializing AI...";
  const TextElement = withText ? (
    <motion.span
      className={`text-${
        color === "light" ? "dark" : "light"
      } text-xs font-mono`}
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 3 * speedValue,
        repeat: Infinity,
      }}
      style={{
        order: textPosition === "right" ? 1 : 0,
        marginLeft: textPosition === "right" ? "0.5rem" : 0,
        marginRight: textPosition === "left" ? "0.5rem" : 0,
        marginTop: textPosition === "bottom" ? "0.5rem" : 0,
        marginBottom: textPosition === "top" ? "0.5rem" : 0,
      }}
    >
      {loadingText}
    </motion.span>
  ) : null;

  // Main spinner render
  const SpinnerCore = () => {
    switch (style) {
      case "holographic":
        return (
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: sizeValue,
                height: sizeValue,
                boxShadow: `0 0 15px 2px ${colorValue}`,
                filter: "blur(1px)",
              }}
            />
            <motion.div
              ref={spinnerRef}
              className="rounded-full border-2 border-transparent"
              style={{
                width: sizeValue,
                height: sizeValue,
                borderTopColor: colorValue,
                borderTopWidth: sizeValue / 8,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: speedValue,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
          </div>
        );

      case "neon":
        return (
          <motion.div
            ref={spinnerRef}
            className="rounded-full border-2 border-transparent"
            style={{
              width: sizeValue,
              height: sizeValue,
              borderTopColor: colorValue,
              borderTopWidth: sizeValue / 8,
              filter: "drop-shadow(0 0 2px currentColor)",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: {
                duration: speedValue,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
        );

      case "particle":
        return (
          <div
            className="relative"
            style={{ width: sizeValue * 1.5, height: sizeValue * 1.5 }}
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-current"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: colorValue,
                  left: "50%",
                  top: "50%",
                  x: particle.x,
                  y: particle.y,
                }}
                animate={{
                  x: [particle.x, -particle.x, particle.x],
                  y: [particle.y, -particle.y, particle.y],
                  transition: {
                    duration: 3 * speedValue * (0.5 + Math.random()),
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              />
            ))}
            <motion.div
              className="absolute rounded-full border-2 border-transparent"
              style={{
                width: sizeValue,
                height: sizeValue,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                borderTopColor: colorValue,
                borderTopWidth: sizeValue / 8,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: speedValue,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
          </div>
        );

      case "futuristic":
      default:
        return (
          <div className="relative">
            {aiMode && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: sizeValue * 1.3,
                  height: sizeValue * 1.3,
                  border: `1px solid ${colorValue}`,
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 3 * speedValue,
                  repeat: Infinity,
                }}
              />
            )}
            <motion.div
              ref={spinnerRef}
              className="rounded-full border-2 border-transparent"
              style={{
                width: sizeValue,
                height: sizeValue,
                borderTopColor: colorValue,
                borderRightColor: colorValue,
                borderTopWidth: sizeValue / 8,
                borderRightWidth: sizeValue / 16,
                opacity: 0.9,
              }}
              animate={{
                rotate: 360,
                borderTopWidth: [sizeValue / 8, sizeValue / 4, sizeValue / 8],
              }}
              transition={{
                rotate: {
                  duration: speedValue,
                  repeat: Infinity,
                  ease: "linear",
                },
                borderTopWidth: {
                  duration: speedValue * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        flexDirection:
          textPosition === "top"
            ? "column-reverse"
            : textPosition === "bottom"
            ? "column"
            : textPosition === "left"
            ? "row-reverse"
            : "row",
        gap:
          textPosition === "top" || textPosition === "bottom"
            ? "0.5rem"
            : "0.75rem",
      }}
      role="status"
      aria-label={typeof withText === "string" ? withText : "Loading..."}
      animate={controls}
    >
      <div className="relative flex items-center justify-center">
        {SpinnerCore()}
        {TrailElements}
      </div>
      {TextElement}
    </motion.div>
  );
};

export default LoadingSpinner;
