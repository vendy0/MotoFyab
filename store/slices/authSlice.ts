/** @format */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Pas encore d'écran de login dans MotoFyab (cf. README, section 7 : "prochaine
// étape confirmée"). En attendant, on préremplit avec l'unique client du mock
// (id 1, "Vendy Ergo") — ça remplace la constante CURRENT_CLIENT_ID qui était
// dupliquée en dur dans conversationService.ts. Le jour où l'auth existe, seul
// ce fichier change : `login()` sera appelé après un vrai appel Supabase, et
// plus rien ailleurs dans l'app n'a besoin d'être touché.
type AuthState = {
	currentUserId: number | null;
	username: string | null;
	role: "client" | "driver" | "admin" | null;
};

const initialState: AuthState = {
	currentUserId: 1,
	username: "vengo",
	role: "client"
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// À appeler une fois l'écran de login branché sur Supabase.
		login: (state, action: PayloadAction<{ userId: number; username: string; role: AuthState["role"] }>) => {
			state.currentUserId = action.payload.userId;
			state.username = action.payload.username;
			state.role = action.payload.role;
		},
		logout: state => {
			state.currentUserId = null;
			state.username = null;
			state.role = null;
		}
	}
});

export const { login, logout } = authSlice.actions;

// Sélecteur pratique : partout où le code faisait `CURRENT_CLIENT_ID`, on peut
// maintenant faire `useAppSelector(selectCurrentUserId)`.
export const selectCurrentUserId = (state) => state.auth.currentUserId;

export default authSlice.reducer;