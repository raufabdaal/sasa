import type { Transition, Variants } from "framer-motion";

/**
 * Sasa motion presets.
 * Source of truth: docs/design-philosophy.md § Motion
 *
 * Rules:
 *  - Springs, not eases.
 *  - Default 380/32/0.9.
 *  - Nothing animates longer than 400ms.
 *  - Nothing repeats.
 *  - Every transition has a job (continuity / state / attention).
 */

export const spring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 1.0,
};

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

/** Use as transition on `fadeUp` / `fadeIn`. */
export const fadeTransition: Transition = { ...spring, duration: 0.32 };
