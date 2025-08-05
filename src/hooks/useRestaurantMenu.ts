import { useState, useEffect } from 'react';

interface Restaurant {
  name: string;
  description: string;
  location: string;
  cuisine_type: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  dietary: string[];
  category: string;
}

interface Menu {
  appetizers: MenuItem[];
  mains: MenuItem[];
  desserts: MenuItem[];
  wines: MenuItem[];
  cocktails: MenuItem[];
}

interface RestaurantData {
  restaurant: Restaurant;
  menu: Menu;
}

export const useRestaurantMenu = (restaurantId: string) => {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamic import of the restaurant data
        const menuData = await import(`@/data/restaurants/${restaurantId}.json`);
        setData(menuData.default);
      } catch (err) {
        console.error('Failed to load menu:', err);
        setError(`Failed to load menu for ${restaurantId}`);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [restaurantId]);

  return {
    restaurant: data?.restaurant || null,
    menu: data?.menu || null,
    loading,
    error
  };
};