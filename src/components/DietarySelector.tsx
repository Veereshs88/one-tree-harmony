import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Leaf, Zap, Utensils } from 'lucide-react';
import { DietaryPreference } from './PairingEngine';

interface DietarySelectorProps {
  value: DietaryPreference;
  onChange: (value: DietaryPreference) => void;
}

const dietaryOptions = [
  {
    value: 'vegetarian' as const,
    label: 'Vegetarian',
    icon: Leaf,
    description: 'Plant-based options and vegetarian-friendly pairings'
  },
  {
    value: 'adventurous' as const,
    label: 'Adventurous',
    icon: Zap,
    description: 'Bold flavors and unique combinations'
  },
  {
    value: 'all' as const,
    label: 'All Options',
    icon: Utensils,
    description: 'Full menu with no dietary restrictions'
  }
];

export const DietarySelector = ({ value, onChange }: DietarySelectorProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {dietaryOptions.map(({ value: optionValue, label, icon: Icon, description }) => (
        <div key={optionValue} className="flex items-start space-x-3">
          <RadioGroupItem value={optionValue} id={optionValue} className="mt-1" />
          <div className="flex-1 cursor-pointer" onClick={() => onChange(optionValue)}>
            <Label htmlFor={optionValue} className="flex items-center gap-2 cursor-pointer">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{label}</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};