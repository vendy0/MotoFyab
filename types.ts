export type Driver = {
  id: string;
  username: string;
  distanceMeters: number;
  trips: number;
  rating: number;
};

export type Comparator = ">" | "<";

export type NumericFilter = {
  comparator: Comparator;
  value: number;
};

export type DriverFilters = {
  rating?: NumericFilter;
  trips?: NumericFilter;
  distanceMeters?: NumericFilter;
};

export type SortOption = "closest" | "topRated" | "mostTrips";

export type ContactRequest = {
  driverId: string;
  pickupLocation: string;
  destination: string;
};

// ---------------------------------------------------------
// Conversation / Archives — types dérivés du schéma mockData.tsx
// (rides, conversations, messages). Champs en snake_case pour
// coller 1:1 aux objets de mockData.tsx.
// ---------------------------------------------------------

export type RideStatus = "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
export type MessageStatus = "sent" | "delivered" | "read";

export type Ride = {
  id: number;
  client_id: number;
  driver_id: number;
  status: RideStatus;
  fee: number;
  estimation: number;
  final_fare: number | null;
  currency: string;
  payment_method: string | null;
  start: string;
  end: string;
  distance_km: number;
  duration_min: number | null;
  requested_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  conversation_id: number | null;
};

/** Message prêt pour l'affichage (camelCase + `isOwn` calculé côté service). */
export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  status: MessageStatus;
  isOwn: boolean;
};

/** Ligne de la liste Archives — une conversation passée résumée. */
export type ConversationSummary = {
  id: number;
  rideId: number;
  driverUsername: string;
  driverRating: number;
  date: string;
  route: string;
  status: "active" | "closed";
  rideStatus: RideStatus;
};

/**
 * État de l'écran Conversation, dérivé de la course active du client
 * (au plus une à la fois) :
 * - "none"    → aucune course en cours (état 1 du wireframe)
 * - "pending" → demande envoyée, en attente d'acceptation (état 2)
 * - "chat"    → course acceptée, conversation ouverte (état 3)
 */
export type ActiveRideState =
  | { kind: "none" }
  | { kind: "pending"; ride: Ride; driverUsername: string }
  | { kind: "chat"; ride: Ride; conversationId: number; driverUsername: string; driverRating: number };
