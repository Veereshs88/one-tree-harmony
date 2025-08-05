import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { MenuItem, DietaryPreference } from './PairingEngine';

interface MenuItemSelectorProps {
  menu: any;
  dietaryPreference: DietaryPreference;
  onSelect: (item: MenuItem) => void;
}

const categoryLabels = {
  appetizers: 'Appetizers',
  mains: 'Main Courses',
  desserts: 'Desserts',
  wines: 'Wines',
  cocktails: 'Cocktails'
};

export const MenuItemSelector = ({ menu, dietaryPreference, onSelect }: MenuItemSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterItems = (items: MenuItem[]) => {
    let filtered = items;

    // Apply dietary filter
    if (dietaryPreference === 'vegetarian') {
      filtered = filtered.filter(item => item.dietary.includes('vegetarian'));
    } else if (dietaryPreference === 'adventurous') {
      filtered = filtered.filter(item => 
        !item.dietary.includes('vegetarian') || 
        item.category === 'wine' || 
        item.category === 'cocktail'
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const allItems = [
    ...menu.appetizers,
    ...menu.mains,
    ...menu.desserts,
    ...menu.wines,
    ...menu.cocktails
  ];

  const filteredAllItems = filterItems(allItems);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="appetizers">Apps</TabsTrigger>
          <TabsTrigger value="mains">Mains</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
          <TabsTrigger value="wines">Wines</TabsTrigger>
          <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {filteredAllItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No items found matching your criteria
            </p>
          ) : (
            filteredAllItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onSelect={onSelect} />
            ))
          )}
        </TabsContent>

        {Object.entries(categoryLabels).map(([category, label]) => (
          <TabsContent key={category} value={category} className="space-y-2">
            {filterItems(menu[category]).map((item: MenuItem) => (
              <MenuItemCard key={item.id} item={item} onSelect={onSelect} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const MenuItemCard = ({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(item)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{item.name}</h3>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            {item.dietary.length > 0 && (
              <div className="flex gap-1">
                {item.dietary.map((diet) => (
                  <Badge key={diet} variant="secondary" className="text-xs">
                    {diet}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <Badge variant="default" className="font-bold">
              ${item.price}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};