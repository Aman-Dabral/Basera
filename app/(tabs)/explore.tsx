import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, RefreshControl } from 'react-native';
import MapView, { UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import { SearchBar } from '../../components/explore/SearchBar';
import { SegmentedControl } from '../../components/explore/SegmentedControl';
import { FilterChips } from '../../components/explore/FilterChips';
import { CustomMarker } from '../../components/explore/CustomMarker';
import { PlaceBottomSheet } from '../../components/explore/PlaceBottomSheet';
import { AreaCard } from '../../components/explore/AreaCard';

import { MOCK_PLACES, MOCK_AREAS, CITY_B_CENTER, PlaceCategory, Place } from '../../constants/MockExploreData';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  
  const [activeViewIndex, setActiveViewIndex] = useState(0); // 0: Map, 1: Areas
  const isMapView = activeViewIndex === 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<PlaceCategory[]>([]);
  
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Derive categories from data or statically defined
  const categories: PlaceCategory[] = ['Food', 'Places to visit', 'Areas/Galis', 'Hidden gems'];

  const handleToggleFilter = (category: PlaceCategory) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const filteredPlaces = useMemo(() => {
    return MOCK_PLACES.filter((place) => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            place.significance.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(place.category);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilters]);

  const filteredAreas = useMemo(() => {
    return MOCK_AREAS.filter((area) => {
      return area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             area.knownFor.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const mapStyle = [
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF3E8', paddingTop: insets.top }}>
      {/* Top Controls Overlay */}
      <View style={{ zIndex: 10, paddingBottom: 10 }}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <SegmentedControl
          options={['Map', 'Areas']}
          selectedIndex={activeViewIndex}
          onChange={setActiveViewIndex}
        />
        {isMapView && (
          <FilterChips
            categories={categories}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
          />
        )}
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {isMapView ? (
          <View style={StyleSheet.absoluteFillObject}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              provider={PROVIDER_DEFAULT}
              initialRegion={CITY_B_CENTER}
              customMapStyle={mapStyle} // Hide default POIs if possible
              mapType="standard"
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              {filteredPlaces.map((place) => (
                <CustomMarker
                  key={place.id}
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onPress={() => handleMarkerPress(place)}
                />
              ))}
            </MapView>
            
            {/* Empty State Overlay on Map */}
            {filteredPlaces.length === 0 && searchQuery.length > 0 && (
              <View className="absolute inset-0 items-center justify-center bg-black/10">
                 <View className="bg-white p-6 rounded-2xl items-center shadow-lg">
                   <Image 
                     source={require('../../assets/illustrations/empty-map-search.png')} 
                     style={{ width: 120, height: 120, resizeMode: 'contain', marginBottom: 16 }} 
                   />
                   <Text className="text-lg font-semibold text-gray-800">No places found</Text>
                   <Text className="text-sm text-gray-500 mt-1">Try a different search or filter</Text>
                 </View>
              </View>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredAreas}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C85322" />}
            renderItem={({ item }) => <AreaCard area={item} onPress={() => {}} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-lg font-semibold text-gray-800">No areas found</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Bottom Sheet for Map Markers */}
      {isMapView && (
        <PlaceBottomSheet
          ref={bottomSheetRef}
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </View>
  );
}
