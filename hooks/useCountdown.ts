import { useEffect, useState } from "react";

/**
 * Countdown vers une deadline ISO donnée. Retourne un label "m:ss" prêt à
 * afficher, et `expired` une fois la deadline dépassée (le compte reste à
 * 0:00 plutôt que de passer en négatif).
 */
export function useCountdown(deadlineIso: string) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(deadlineIso).getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(new Date(deadlineIso).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  const clamped = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const label = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return { remainingMs: clamped, label, expired: clamped <= 0, totalSeconds};
}
