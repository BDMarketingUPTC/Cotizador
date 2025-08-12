// components/StepCounter.tsx
import React, { useState } from "react";
import Button from "./Button";

interface StepCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
}

const StepCounter: React.FC<StepCounterProps> = ({
  label,
  value,
  onChange,
  unit = "",
  min = 0,
  max = Infinity,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      if (numValue < min) {
        onChange(min);
      } else if (numValue > max) {
        onChange(max);
      } else {
        onChange(numValue);
      }
    } else {
      setInputValue(value.toString());
    }
  };

  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-brand-dark mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleDecrement}
          disabled={value <= min}
          className="px-3 py-1 text-lg bg-brand-brown hover:bg-brand-light-brown text-white transition-colors"
        >
          -
        </Button>
        <div className="relative flex-grow">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInputBlur();
              }
            }}
            className="w-full text-center text-lg font-semibold p-2 border border-brand-off-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown transition-all"
            min={min}
            max={max === Infinity ? undefined : max}
          />
          {unit && (
            <span className="absolute inset-y-0 right-3 flex items-center text-brand-dark pointer-events-none">
              {unit}
            </span>
          )}
        </div>
        <Button
          onClick={handleIncrement}
          disabled={value >= max}
          className="px-3 py-1 text-lg bg-brand-brown hover:bg-brand-light-brown text-white transition-colors"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default StepCounter;
