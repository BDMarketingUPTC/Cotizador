// components/SelectYesNo.tsx
import React from "react";
import Button from "./Button";

interface SelectYesNoProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SelectYesNo: React.FC<SelectYesNoProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-2">
        <Button
          onClick={() => onChange(true)}
          className={`${
            value
              ? "bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sí
        </Button>
        <Button
          onClick={() => onChange(false)}
          className={`${
            !value
              ? "bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default SelectYesNo;
