// components/StepCounter.tsx
import React from "react";
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

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleDecrement}
          disabled={value <= min}
          className="px-3 py-1 text-lg"
        >
          -
        </Button>
        <span className="flex-grow text-center text-lg font-semibold p-2 border border-gray-300 rounded-lg">
          {value} {unit}
        </span>
        <Button
          onClick={handleIncrement}
          disabled={value >= max}
          className="px-3 py-1 text-lg"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default StepCounter;
