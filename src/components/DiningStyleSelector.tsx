import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wine, Coffee, Briefcase, PartyPopper, Clock } from 'lucide-react';
import { DiningStyle } from './PairingEngine';

interface DiningStyleSelectorProps {
  value: DiningStyle;
  onChange: (value: DiningStyle) => void;
}

const diningStyles = [
  {
    value: 'romantic' as const,
    label: 'Romantic',
    icon: Wine,
    description: 'Intimate dining with sophisticated pairings'
  },
  {
    value: 'casual' as const,
    label: 'Casual',
    icon: Coffee,
    description: 'Relaxed atmosphere with approachable flavors'
  },
  {
    value: 'business' as const,
    label: 'Business',
    icon: Briefcase,
    description: 'Professional setting with refined selections'
  },
  {
    value: 'celebration' as const,
    label: 'Celebration',
    icon: PartyPopper,
    description: 'Special occasion with premium pairings'
  },
  {
    value: 'quick' as const,
    label: 'Quick Bite',
    icon: Clock,
    description: 'Efficient dining with simple combinations'
  }
];

export const DiningStyleSelector = ({ value, onChange }: DiningStyleSelectorProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {diningStyles.map(({ value: styleValue, label, icon: Icon, description }) => (
        <div key={styleValue} className="flex items-start space-x-3">
          <RadioGroupItem value={styleValue} id={styleValue} className="mt-1" />
          <div className="flex-1 cursor-pointer" onClick={() => onChange(styleValue)}>
            <Label htmlFor={styleValue} className="flex items-center gap-2 cursor-pointer">
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