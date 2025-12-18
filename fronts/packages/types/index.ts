// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  RESTAURANT_STAFF = 'RESTAURANT_STAFF',
  CUSTOMER = 'CUSTOMER',
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  heroImage?: string;
  theme?: RestaurantTheme;
  settings?: RestaurantSettings;
  ownerId: string;
  status: RestaurantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'modern' | 'elegant' | 'casual';
  backgroundColor: string;
}

export interface RestaurantSettings {
  maxTablesPerSlot: number;
  slotDuration: number; // en minutos
  advanceBookingDays: number;
  requireDeposit: boolean;
  depositAmount?: number;
  enablePreOrder: boolean;
  enableTableOrder: boolean;
  enableWhatsApp: boolean;
}

export enum RestaurantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Table Types
export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  section?: string;
  status: TableStatus;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
}

// Reservation Types
export interface Reservation {
  id: string;
  restaurantId: string;
  customerId: string;
  tableId?: string;
  date: Date;
  time: string;
  partySize: number;
  status: ReservationStatus;
  specialRequests?: string;
  depositPaid: boolean;
  depositAmount?: number;
  preOrderId?: string;
  confirmationSentAt?: Date;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Menu Types
export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
  allergens?: string[];
  available: boolean;
  isPreOrderOnly: boolean;
  preparationTime?: number; // en minutos
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  reservationId?: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  status: OrderStatus;
  type: OrderType;
  paymentMethod?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  status: OrderItemStatus;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum OrderItemStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
}

export enum OrderType {
  PRE_ORDER = 'PRE_ORDER',
  TABLE_ORDER = 'TABLE_ORDER',
  WALK_IN = 'WALK_IN',
}

// Customer Preferences (Intelligence Engine)
export interface CustomerPreference {
  id: string;
  customerId: string;
  preferenceType: PreferenceType;
  value: string;
  source: PreferenceSource;
  confidence: number; // 0-1
  createdAt: Date;
  updatedAt: Date;
}

export enum PreferenceType {
  DIETARY = 'DIETARY',
  ALLERGEN = 'ALLERGEN',
  CUISINE = 'CUISINE',
  OCCASION = 'OCCASION',
  PRICE_RANGE = 'PRICE_RANGE',
  AMBIANCE = 'AMBIANCE',
}

export enum PreferenceSource {
  EXPLICIT = 'EXPLICIT', // Usuario lo dijo directamente
  IMPLICIT = 'IMPLICIT', // Inferido de comportamiento
  ML_PREDICTED = 'ML_PREDICTED', // Predicho por ML
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
