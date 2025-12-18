import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import RestaurantView from '@/components/restaurant-view';

// This will be used to fetch restaurant data by slug
async function getRestaurantBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${apiUrl}/restaurants/slug/${slug}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

export default async function RestaurantPage() {
  // In Next.js 15+, headers() returns a promise
  const headersList = await headers();
  const slug = headersList.get('x-restaurant-slug');

  // If no slug, show landing page (redirect to main domain)
  if (!slug) {
    return null;
  }

  // Fetch restaurant by slug
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantView restaurant={restaurant} />;
}

// Generate metadata dynamically based on restaurant
export async function generateMetadata() {
  // In Next.js 15+, headers() returns a promise
  const headersList = await headers();
  const slug = headersList.get('x-restaurant-slug');

  if (!slug) {
    return {
      title: 'YumYum - Reserva tu mesa',
      description: 'Descubre y reserva en los mejores restaurantes',
    };
  }

  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return {
      title: 'Restaurante no encontrado',
    };
  }

  return {
    title: `${restaurant.name} - Reserva tu mesa | YumYum`,
    description: restaurant.description || `Reserva en ${restaurant.name} - ${restaurant.cuisine}`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description,
      images: restaurant.images?.[0] ? [restaurant.images[0]] : [],
    },
  };
}
