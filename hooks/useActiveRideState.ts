// import { useCallback, useMemo, useState } from "react";

// import { getActiveRideState } from "@/services/conversationService";
// import { ActiveRideState } from "@/types";

// /**
//  * Enveloppe getActiveRideState() avec un état local pour simuler
//  * l'annulation d'une demande en attente, en attendant un vrai backend
//  * (Supabase). Rien n'est persisté dans mockData.tsx : recharger l'app
//  * revient à l'état d'origine du mock.
//  */
// export function useActiveRideState() {
//   const initial = useMemo(() => getActiveRideState(), []);
//   const [state, setState] = useState<ActiveRideState>(initial);

//   const cancelPendingRequest = useCallback(() => {
//     setState({ kind: "none" });
//   }, []);

//   return { state, cancelPendingRequest };
// }


/** @format */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cancelPendingRequest, selectActiveRideState } from "@/store/slices/activeRideSlice";

// Même API que la version useState d'avant ({ state, cancelPendingRequest }),
// mais la donnée vit maintenant dans le store Redux au lieu d'un useState
// local — donc accessible/modifiable depuis n'importe quel autre écran plus
// tard (ex: notif push d'acceptation de course).
export function useActiveRideState() {
	const state = useAppSelector(selectActiveRideState);
	const dispatch = useAppDispatch();

	return {
		state,
		cancelPendingRequest: () => dispatch(cancelPendingRequest())
	};
}