/** @format */
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	getArchivedConversations,
	getConversationMessages,
	getConversationMeta,
	CURRENT_CLIENT_ID
} from "@/services/conversationService";
import { ChatMessage, ConversationSummary, Ride } from "@/types";

// `fakeBaseQuery()` : comme dans l'exemple recipesApi, on n'utilise pas fetch()
// puisqu'on lit du mock en local (pas de vrai réseau pour l'instant). Le jour
// où mockData.tsx est remplacé par Supabase, seules les fonctions à l'intérieur
// de chaque endpoint changent (elles feront un vrai `await supabase.from(...)`)
// — les composants qui consomment `useGetConversationMessagesQuery` etc. ne
// changeront pas d'une ligne.

// Type de retour exact de getConversationMeta (conversation + ride + infos chauffeur).
type ConversationMeta = NonNullable<ReturnType<typeof getConversationMeta>>;

export const conversationApi = createApi({
	reducerPath: "conversationApi",
	baseQuery: fakeBaseQuery<string>(),

	// tagTypes sert à savoir quoi invalider/rafraîchir. On ne les utilise pas
	// encore activement (pas de vrai serveur qui invaliderait à distance),
	// mais ils sont posés pour plus tard.
	tagTypes: ["Messages", "Archive", "Meta"],

	endpoints: builder => ({
		// ---- ARCHIVES --------------------------------------------------
		// Mis en cache SANS argument (une seule entrée de cache pour toute la
		// liste). Utile car l'écran archives/index.tsx et un futur écran
		// "résumé" pourraient tous les deux vouloir cette liste sans la
		// recalculer depuis mockData.tsx à chaque fois.
		getArchivedConversations: builder.query<ConversationSummary[], void>({
			queryFn: async () => {
				const data = getArchivedConversations();
				return { data };
			},
			providesTags: ["Archive"]
		}),

		// ---- META D'UNE CONVERSATION ------------------------------------
		// Caché PAR conversationId : si tu quittes le chat et reviens dessus
		// dans la même session, pas besoin de rescanner rides/users/conversations.
		getConversationMeta: builder.query<ConversationMeta, number>({
			queryFn: async conversationId => {
				const data = getConversationMeta(conversationId);
				if (!data) return { error: "Conversation introuvable" };
				return { data };
			},
			providesTags: (result, error, conversationId) => [{ type: "Meta", id: conversationId }]
		}),

		// ---- MESSAGES D'UNE CONVERSATION --------------------------------
		// Caché par conversationId aussi. Contrairement aux archives (figées,
		// une conversation archivée ne reçoit plus de messages), celle-ci DOIT
		// pouvoir être mise à jour — c'est le rôle de sendMessage ci-dessous.
		getConversationMessages: builder.query<ChatMessage[], number>({
			queryFn: async conversationId => {
				const data = getConversationMessages(conversationId);
				return { data };
			},
			providesTags: (result, error, conversationId) => [{ type: "Messages", id: conversationId }]
		}),

		// ---- ENVOI D'UN MESSAGE (mutation) -------------------------------
		// Pas de vrai backend : on construit le message côté client (comme le
		// faisait l'écran [id].tsx avant, avec Date.now() en id temporaire),
		// puis on l'injecte NOUS-MÊMES dans le cache de getConversationMessages
		// via `updateQueryData`. C'est l'équivalent RTK Query d'un
		// `setMessages(prev => [...prev, newMessage])`, sauf que ça vit dans le
		// store et pas dans un useState d'écran — donc ça persiste si on quitte
		// puis revient sur l'écran.
		// Plus tard (vrai backend) : on gardera ce même `updateQueryData` comme
		// mise à jour OPTIMISTE (affichage immédiat), et on ajoutera un
		// `invalidatesTags` en cas d'échec réel de l'envoi pour resynchroniser.
		sendMessage: builder.mutation<ChatMessage, { conversationId: number; content: string; ride: Ride }>({
			queryFn: async ({ conversationId, content, ride }, { dispatch }) => {
				const newMessage: ChatMessage = {
					id: Date.now(),
					conversationId,
					senderId: CURRENT_CLIENT_ID,
					receiverId: ride.driver_id,
					content,
					sentAt: new Date().toISOString(),
					status: "sent",
					isOwn: true
				};

				dispatch(
					conversationApi.util.updateQueryData("getConversationMessages", conversationId, draft => {
						draft.push(newMessage);
					})
				);

				return { data: newMessage };
			}
		})
	})
});

// Hooks générés automatiquement — c'est ce que tes écrans vont importer.
export const {
	useGetArchivedConversationsQuery,
	useGetConversationMetaQuery,
	useGetConversationMessagesQuery,
	useSendMessageMutation
} = conversationApi;