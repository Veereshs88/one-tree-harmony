import { MenuItem, DiningStyle, DietaryPreference, PairingSuggestion } from '@/components/PairingEngine';

interface PairingRequest {
  selectedItem: MenuItem;
  diningStyle: DiningStyle;
  dietaryPreference: DietaryPreference;
  menu: any;
  restaurant: any;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generatePairings = async ({
  selectedItem,
  diningStyle,
  dietaryPreference,
  menu,
  restaurant
}: PairingRequest): Promise<PairingSuggestion[]> => {
  
  // Collect all menu items for AI reference
  const allItems = [
    ...menu.appetizers,
    ...menu.mains,
    ...menu.desserts,
    ...menu.wines,
    ...menu.cocktails
  ];

  // Filter items based on dietary preferences
  const filteredItems = allItems.filter(item => {
    if (dietaryPreference === 'vegetarian') {
      return item.dietary.includes('vegetarian');
    }
    if (dietaryPreference === 'adventurous') {
      return !item.dietary.includes('vegetarian') || item.category === 'wine' || item.category === 'cocktail';
    }
    return true; // 'all' option
  });

  // Remove the selected item from pairing options
  const availableForPairing = filteredItems.filter(item => item.id !== selectedItem.id);

  const prompt = `
CONTEXT: ${restaurant.name} - ${restaurant.description}
CUISINE: ${restaurant.cuisine_type}

USER SELECTION:
- Dish: ${selectedItem.name} (${selectedItem.description}) - $${selectedItem.price}
- Dining Style: ${diningStyle}
- Dietary Preference: ${dietaryPreference}

AVAILABLE MENU ITEMS FOR PAIRING:
${availableForPairing.map(item => 
  `- ${item.name} (${item.category}) - $${item.price}: ${item.description}`
).join('\n')}

TASK: Suggest exactly 2-3 perfect pairings from different menu categories that complement the selected dish.

REQUIREMENTS:
- Consider the ${diningStyle} dining style when selecting items
- Respect ${dietaryPreference} dietary preferences
- Choose items from different categories when possible
- Focus on flavor harmony, texture contrast, and overall dining experience
- Consider price point appropriate for ${diningStyle} dining

FORMAT YOUR RESPONSE AS JSON:
{
  "pairings": [
    {
      "item_name": "exact menu item name",
      "explanation": "concise explanation (max 40 words)",
      "confidence": 85
    }
  ]
}

Only suggest items that exist in the available menu items list above.
`;

  try {
    if (!OPENAI_API_KEY) {
      // Fallback suggestions when no API key
      return generateFallbackPairings(selectedItem, availableForPairing);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sommelier and culinary pairing specialist. Provide precise, sophisticated pairing recommendations based on flavor profiles, textures, and dining experiences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(content);
    
    // Map AI suggestions to our format
    const suggestions: PairingSuggestion[] = parsedResponse.pairings.map((pairing: any) => {
      const matchedItem = availableForPairing.find(item => 
        item.name === pairing.item_name
      );
      
      if (!matchedItem) {
        throw new Error(`AI suggested non-existent item: ${pairing.item_name}`);
      }

      return {
        item: matchedItem,
        explanation: pairing.explanation,
        confidence: pairing.confidence || 80
      };
    });

    return suggestions;

  } catch (error) {
    console.error('AI pairing generation failed:', error);
    // Fall back to rule-based suggestions
    return generateFallbackPairings(selectedItem, availableForPairing);
  }
};

const generateFallbackPairings = (selectedItem: MenuItem, availableItems: MenuItem[]): PairingSuggestion[] => {
  const suggestions: PairingSuggestion[] = [];
  
  // Simple rule-based pairing logic
  if (selectedItem.category === 'main') {
    // Suggest wine and dessert
    const wine = availableItems.find(item => item.category === 'wine');
    const dessert = availableItems.find(item => item.category === 'dessert');
    
    if (wine) {
      suggestions.push({
        item: wine,
        explanation: 'Classic wine pairing to complement your main course',
        confidence: 75
      });
    }
    
    if (dessert) {
      suggestions.push({
        item: dessert,
        explanation: 'Sweet finish to complete your dining experience',
        confidence: 70
      });
    }
  } else if (selectedItem.category === 'appetizer') {
    // Suggest main and wine
    const main = availableItems.find(item => item.category === 'main');
    const wine = availableItems.find(item => item.category === 'wine');
    
    if (main) {
      suggestions.push({
        item: main,
        explanation: 'Perfect main course to follow your appetizer',
        confidence: 80
      });
    }
    
    if (wine) {
      suggestions.push({
        item: wine,
        explanation: 'Excellent wine to accompany your meal',
        confidence: 75
      });
    }
  }
  
  // Always suggest a cocktail if available
  const cocktail = availableItems.find(item => item.category === 'cocktail');
  if (cocktail && suggestions.length < 3) {
    suggestions.push({
      item: cocktail,
      explanation: 'Craft cocktail to enhance your dining experience',
      confidence: 70
    });
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
};