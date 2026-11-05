export type StudioCategory =
  | "photo-studios"
  | "sound-stages"
  | "podcast-rooms"
  | "music-suites"
  | "art-workshops";

export type StudioReview = {
  name?: string;
  avatar?: string;
  rating?: number;
  date?: string;
  comment?: string;
};

export type Studio = {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  ownerName: string;
  ownerEmail: string;
  rating?: number;
  createdAt?: string;
  status?: "active" | "inactive" | "pending";
  gallery?: string[];
  reviews?: StudioReview[];
  ownerImage?: string;
};

export type StudioFormValues = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  rating: string;
};

export type StudioPayload = Omit<Studio, "_id" | "createdAt" | "rating"> & {
  rating?: number;
};