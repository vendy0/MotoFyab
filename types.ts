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
