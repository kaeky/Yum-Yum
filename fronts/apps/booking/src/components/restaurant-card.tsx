'use client';

import { Button, Badge } from '@yumyum/ui';
import Link from 'next/link';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    description: string;
    city: string;
    cuisine: string;
    rating: number;
    reviewCount: number;
    priceRange: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // For local development, use query param. For production, use subdomain
  const getRestaurantUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      // Local: use query param
      return `/?restaurant=${restaurant.slug}`;
    } else {
      // Production: use subdomain
      return `https://${restaurant.slug}.yumyum.com`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
        {restaurant.images && restaurant.images.length > 0 ? (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.isFeatured && (
            <Badge className="bg-yellow-500 text-white border-0">⭐ Destacado</Badge>
          )}
          {!restaurant.isActive && (
            <Badge variant="secondary" className="bg-gray-500 text-white border-0">
              Cerrado
            </Badge>
          )}
        </div>

        {/* Price Range */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-gray-800 border-0 font-medium">
            {restaurant.priceRange}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Cuisine */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{restaurant.cuisine}</span>
            <span>•</span>
            <span>{restaurant.city}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {restaurant.description}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="text-lg font-bold text-gray-900">
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">({restaurant.reviewCount} reseñas)</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={getRestaurantUrl()} className="block">
          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
            disabled={!restaurant.isActive}
          >
            {restaurant.isActive ? 'Ver Restaurante y Reservar' : 'No Disponible'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
