import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { DiningStyleSelector } from './DiningStyleSelector';
import { DietarySelector } from './DietarySelector';
import { MenuItemSelector } from './MenuItemSelector';
import { PairingResults } from './PairingResults';
import { generatePairings } from '@/lib/ai-pairing';
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu';

export type DiningStyle = 'romantic' | 'casual' | 'business' | 'celebration' | 'quick';
export type DietaryPreference = 'vegetarian' | 'adventurous' | 'all';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  dietary: string[];
  category: string;
}

export interface PairingSuggestion {
  item: MenuItem;
  explanation: string;
  confidence: number;
}

const PairingEngine = () => {
  const { menu, restaurant, loading, error } = useRestaurantMenu('one-tree-grill');
  const [diningStyle, setDiningStyle] = useState<DiningStyle>('casual');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [pairings, setPairings] = useState<PairingSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);

  const handleGeneratePairings = async () => {
    if (!selectedItem || !menu) return;

    setIsGenerating(true);
    setPairingError(null);

    try {
      const suggestions = await generatePairings({
        selectedItem,
        diningStyle,
        dietaryPreference,
        menu,
        restaurant
      });
      setPairings(suggestions);
    } catch (error) {
      console.error('Failed to generate pairings:', error);
      setPairingError('Failed to generate pairings. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setSelectedItem(null);
    setPairings([]);
    setPairingError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !menu || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Failed to load restaurant menu</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              PairCraft
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            AI-Powered Menu Pairing for {restaurant.name}
          </p>
          <Badge variant="secondary" className="text-sm">
            {restaurant.cuisine_type} • {restaurant.location}
          </Badge>
        </div>

        {!selectedItem ? (
          /* Configuration Phase */
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dining Style</CardTitle>
              </CardHeader>
              <CardContent>
                <DiningStyleSelector value={diningStyle} onChange={setDiningStyle} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <DietarySelector value={dietaryPreference} onChange={setDietaryPreference} />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Selected Item Display */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Selected Item
                <Button variant="outline" size="sm" onClick={handleStartOver}>
                  Start Over
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <Badge variant="secondary">${selectedItem.price}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Selection */}
        {!selectedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Dish</CardTitle>
            </CardHeader>
            <CardContent>
              <MenuItemSelector
                menu={menu}
                dietaryPreference={dietaryPreference}
                onSelect={setSelectedItem}
              />
            </CardContent>
          </Card>
        )}

        {/* Generate Pairings Button */}
        {selectedItem && pairings.length === 0 && (
          <div className="text-center">
            <Button
              onClick={handleGeneratePairings}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Crafting Perfect Pairings...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Perfect Pairings
                </>
              )}
            </Button>
          </div>
        )}

        {/* Error Display */}
        {pairingError && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-center text-destructive">{pairingError}</p>
              <div className="text-center mt-4">
                <Button variant="outline" onClick={handleGeneratePairings}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {pairings.length > 0 && (
          <PairingResults
            selectedItem={selectedItem!}
            pairings={pairings}
            onTryAgain={handleGeneratePairings}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default PairingEngine;