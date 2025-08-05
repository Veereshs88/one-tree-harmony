import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Star, DollarSign } from 'lucide-react';
import { MenuItem, PairingSuggestion } from './PairingEngine';

interface PairingResultsProps {
  selectedItem: MenuItem;
  pairings: PairingSuggestion[];
  onTryAgain: () => void;
  isGenerating: boolean;
}

export const PairingResults = ({ 
  selectedItem, 
  pairings, 
  onTryAgain, 
  isGenerating 
}: PairingResultsProps) => {
  const totalPrice = selectedItem.price + pairings.reduce((sum, p) => sum + p.item.price, 0);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Perfect Pairings Found</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onTryAgain}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Different Pairings
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${selectedItem.price}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pairing Suggestions */}
      <div className="grid gap-4">
        {pairings.map((pairing, index) => (
          <Card key={pairing.item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{pairing.item.name}</h3>
                    <Badge variant="outline" className="capitalize">
                      {pairing.item.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{pairing.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pairing.item.description}
                  </p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm italic">
                      <strong>Why this works:</strong> {pairing.explanation}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <Badge variant="default" className="text-lg px-3 py-1 font-bold">
                    ${pairing.item.price}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Price Summary */}
      <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Complete Pairing Experience</h3>
              <p className="text-sm text-muted-foreground">
                {pairings.length + 1} carefully selected items for the perfect meal
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <DollarSign className="h-6 w-6" />
                {totalPrice}
              </div>
              <p className="text-sm text-muted-foreground">Total Experience</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{selectedItem.name}</span>
              <span>${selectedItem.price}</span>
            </div>
            {pairings.map((pairing) => (
              <div key={pairing.item.id} className="flex justify-between text-sm">
                <span>{pairing.item.name}</span>
                <span>${pairing.item.price}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};