export type PlaceCategory = 'Food' | 'Places to visit' | 'Areas/Galis' | 'Hidden gems';

export interface Place {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  category: PlaceCategory;
  significance: string;
  photoUrl?: string;
  cuisine?: string;
  priceRange?: string;
  localReputation?: string;
}

export interface Area {
  id: string;
  name: string;
  tier: string;
  vibe: string;
  knownFor: string;
  photoUrl?: string;
}

// City B coordinates roughly (e.g., center of some city, using Delhi roughly for context)
export const CITY_B_CENTER = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const MOCK_PLACES: Place[] = [
  {
    id: 'p1',
    name: 'Old Famous Jalebi Wala',
    coordinate: { latitude: 28.6550, longitude: 77.2300 },
    category: 'Food',
    significance: 'Iconic sweet shop since 1884',
    cuisine: 'Street Food, Sweets',
    priceRange: '₹',
    localReputation: 'Must-visit, long queues on weekends',
  },
  {
    id: 'p2',
    name: 'Red Fort',
    coordinate: { latitude: 28.6562, longitude: 77.2410 },
    category: 'Places to visit',
    significance: 'Historic fort and UNESCO World Heritage Site',
  },
  {
    id: 'p3',
    name: 'Chandni Chowk',
    coordinate: { latitude: 28.6505, longitude: 77.2303 },
    category: 'Areas/Galis',
    significance: 'Bustling market area full of history and food',
  },
  {
    id: 'p4',
    name: 'Mirza Ghalib Ki Haveli',
    coordinate: { latitude: 28.6486, longitude: 77.2330 },
    category: 'Hidden gems',
    significance: 'Restored residence of the famous Urdu poet',
  },
  {
    id: 'p5',
    name: 'Karim\'s',
    coordinate: { latitude: 28.6496, longitude: 77.2338 },
    category: 'Food',
    significance: 'Legendary Mughlai cuisine',
    cuisine: 'Mughlai, North Indian',
    priceRange: '₹₹',
    localReputation: 'Authentic taste, historic vibe',
  },
];

export const MOCK_AREAS: Area[] = [
  {
    id: 'a1',
    name: 'Hauz Khas Village',
    tier: 'Premium',
    vibe: 'Arts & Nightlife',
    knownFor: 'Boutiques, cafes, historic fort ruins, and vibrant nightlife.',
  },
  {
    id: 'a2',
    name: 'Connaught Place',
    tier: 'Commercial Hub',
    vibe: 'Colonial Charm & Shopping',
    knownFor: 'Circular Georgian architecture, high-end stores, and eateries.',
  },
  {
    id: 'a3',
    name: 'Shahpur Jat',
    tier: 'Mid-range / Premium',
    vibe: 'Bohemian & Design',
    knownFor: 'Independent designer boutiques, cozy cafes, and narrow streets.',
  },
  {
    id: 'a4',
    name: 'Lajpat Nagar',
    tier: 'Mid-range',
    vibe: 'Bustling Market',
    knownFor: 'Affordable shopping, street food, and vibrant street life.',
  },
];
