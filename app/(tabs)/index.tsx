/** @format */

import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { HardShadow, Radii, BorderWidth } from "@/constants/theme";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import DriverCard from "@/components/driver/DriverCard";
import ContactModal from "@/components/driver/ContactModal";
import DropdownMenu from "@/components/filters/DropdownMenu";
import IconMenu from "@/components/filters/IconMenu";
import FilterModal from "@/components/filters/FilterModal";

import { getAvailableDrivers } from "@/services/driverService";
import { ContactRequest, Driver, DriverFilters, SortOption } from "@/types";
import { CITIES, SORT_LABELS, SORT_OPTIONS, SORT_BY_LABEL } from "@/services/options"

export default function HomeScreen() {
	const [city, setCity] = useState(CITIES[0]);
	const [sortBy, setSortBy] = useState<SortOption>("closest");
	const [filters, setFilters] = useState<DriverFilters>({});
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

	const colorScheme = useColorScheme() ?? "light";
	const iconColor = useThemeColor({}, "icon");
	const borderColor = useThemeColor({}, "border");
	const hardShadow = HardShadow[colorScheme];

	const drivers = useMemo(
		() => getAvailableDrivers({ city, sortBy, filters }),
		[city, sortBy, filters]
	);

	const handleConfirmContact = (details: { pickupLocation: string; destination: string }) => {
		if (!selectedDriver) return;
		const request: ContactRequest = { driverId: selectedDriver.id, ...details };
		// TODO: envoyer `request` au chauffeur (API / socket) une fois branché
		console.log("Demande de course envoyée :", request);
		setSelectedDriver(null);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView style={styles.screen}>
				{/* Logos MotoFyab (gauche) et Infinity Holdings S.A. (droite).
	          Emplacements en attente tant que les fichiers ne sont pas fournis. */}
				<View style={styles.logoRow}>
					<ThemedView
						style={[styles.logoBox, { borderColor }, hardShadow]}
						lightColor="#F2760F"
						darkColor="#FF8A3D"
					>
						<ThemedText style={[styles.logoPlaceholder, styles.logoPlaceholderLight]}>
							MotoFyab
						</ThemedText>
					</ThemedView>
					<ThemedView
						style={[styles.logoBox, { borderColor }, hardShadow]}
						lightColor="#12203A"
						darkColor="#16294A"
					>
						<ThemedText style={[styles.logoPlaceholder, styles.logoPlaceholderLight]}>
							{"Infinity\nHoldings S.A."}
						</ThemedText>
					</ThemedView>
				</View>

				<View style={styles.controlsRow}>
					<DropdownMenu label="Ville" options={CITIES} selected={city} onSelect={setCity} />
					<IconMenu
						icon={<ArrowUpDown size={20} color={iconColor} strokeWidth={3} />}
						options={SORT_OPTIONS}
						selected={SORT_LABELS[sortBy]}
						onSelect={label => setSortBy(SORT_BY_LABEL[label])}
					/>
					{/* Le filtre ouvre une modale complète (comparateurs + valeurs), pas un simple menu */}
					<Pressable
						style={[styles.filterButton, { borderColor }, hardShadow]}
						onPress={() => setFilterModalVisible(true)}
					>
						<SlidersHorizontal size={20} color={iconColor} strokeWidth={3} />
					</Pressable>
				</View>

				<ThemedText type="subtitle" style={styles.heading}>
					Chauffeurs disponibles
				</ThemedText>

				<FlatList
					data={drivers}
					keyExtractor={item => item.id}
					renderItem={({ item }) => <DriverCard driver={item} onPress={setSelectedDriver} />}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={
						<ThemedText style={styles.emptyText}>Aucun chauffeur ne correspond à ces critères.</ThemedText>
					}
				/>

				<FilterModal
					visible={filterModalVisible}
					initialFilters={filters}
					onClose={() => setFilterModalVisible(false)}
					onApply={setFilters}
				/>

				<ContactModal
					visible={!!selectedDriver}
					driver={selectedDriver}
					onCancel={() => setSelectedDriver(null)}
					onConfirm={handleConfirmContact}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	screen: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 12
	},
	logoRow: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 20
	},
	logoBox: {
		flex: 1,
		height: 72,
		borderRadius: Radii.md,
		borderWidth: BorderWidth.thick,
		alignItems: "center",
		justifyContent: "center"
	},
	logoPlaceholder: {
		fontSize: 12,
		fontWeight: "700",
		textAlign: "center",
		letterSpacing: 0.3
	},
	logoPlaceholderLight: {
		color: "#FFFFFF"
	},
	controlsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 22
	},
	filterButton: {
		width: 46,
		height: 46,
		borderRadius: Radii.sm,
		borderWidth: BorderWidth.thick,
		alignItems: "center",
		justifyContent: "center"
	},
	heading: {
		marginBottom: 14
	},
	list: {
		paddingBottom: 24
	},
	emptyText: {
		textAlign: "center",
		opacity: 0.6,
		marginTop: 24
	}
});
