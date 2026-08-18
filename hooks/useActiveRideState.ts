import { useCallback, useMemo, useState } from "react";

import { getActiveRideState } from "@/services/conversationService";
import { ActiveRideState } from "@/types";

/**
 * Enveloppe getActiveRideState() avec un état local pour simuler
 * l'annulation d'une demande en attente, en attendant un vrai backend
 * (Supabase). Rien n'est persisté dans mockData.tsx : recharger l'app
 * revient à l'état d'origine du mock.
 */
export function useActiveRideState() {
  const initial = useMemo(() => getActiveRideState(), []);
  const [state, setState] = useState<ActiveRideState>(initial);

  const cancelPendingRequest = useCallback(() => {
    setState({ kind: "none" });
  }, []);

  return { state, cancelPendingRequest };
}
