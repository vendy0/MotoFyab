import { driver_profiles, users } from "@/mockData";
import { Driver, DriverFilters, SortOption } from "@/types";

/**
 * Point de référence temporaire pour calculer la distance (Pétion-Ville).
 * À remplacer par la position GPS réelle du client une fois la géolocalisation branchée.
 */
const REFERENCE_LOCATION = { lat: 18.5392, lon: -72.2852 };

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/** Distance à vol d'oiseau entre deux points GPS, en mètres. */
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusMeters * c);
}

/**
 * Assemble un Driver[] à partir de "users" (role: driver) + "driver_profiles".
 * Seuls les chauffeurs en ligne (is_online) sont considérés "disponibles".
 */
function buildAvailableDrivers(): Driver[] {
  return driver_profiles
    .filter((profile) => profile.is_online)
    .map((profile) => {
      const user = users.find((u) => u.id === profile.user_id && u.role === "driver");
      if (!user) return null;

      const hasLocation = profile.location_lat != null && profile.location_lon != null;
      const distanceMeters = hasLocation
        ? haversineDistanceMeters(
            REFERENCE_LOCATION.lat,
            REFERENCE_LOCATION.lon,
            profile.location_lat as number,
            profile.location_lon as number
          )
        : Number.POSITIVE_INFINITY;

      const driver: Driver = {
        id: String(user.id),
        username: `${user.first_name} ${user.last_name}`,
        distanceMeters,
        trips: user.success_rides,
        rating: profile.rate,
      };
      return driver;
    })
    .filter((driver): driver is Driver => driver !== null);
}

function matchesFilter(value: number, filter?: { comparator: ">" | "<"; value: number }) {
  if (!filter) return true;
  return filter.comparator === ">" ? value > filter.value : value < filter.value;
}

function applyFilters(drivers: Driver[], filters?: DriverFilters): Driver[] {
  if (!filters) return drivers;
  return drivers.filter(
    (driver) =>
      matchesFilter(driver.rating, filters.rating) &&
      matchesFilter(driver.trips, filters.trips) &&
      matchesFilter(driver.distanceMeters, filters.distanceMeters)
  );
}

function applySort(drivers: Driver[], sortBy?: SortOption): Driver[] {
  const sorted = [...drivers];
  switch (sortBy) {
    case "topRated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "mostTrips":
      return sorted.sort((a, b) => b.trips - a.trips);
    case "closest":
    default:
      return sorted.sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}

type GetDriversOptions = {
  /**
   * TODO: mockData.tsx n'a pas encore de champ "ville" par chauffeur.
   * Ce paramètre est accepté mais ignoré pour l'instant — à brancher
   * dès que le champ sera ajouté au schéma (driver_profiles.city ?).
   */
  city?: string;
  sortBy?: SortOption;
  filters?: DriverFilters;
};

/**
 * Point d'entrée unique pour récupérer les chauffeurs disponibles.
 * Quand tu passeras à une vraie base de données, seul ce fichier
 * doit changer — la signature de getAvailableDrivers() reste la même.
 */
export function getAvailableDrivers(options: GetDriversOptions = {}): Driver[] {
  const drivers = buildAvailableDrivers();
  const filtered = applyFilters(drivers, options.filters);
  return applySort(filtered, options.sortBy);
}
