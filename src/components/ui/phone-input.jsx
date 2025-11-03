import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";



const PhoneInput =
  React.forwardRef(
    ({ className, onChange, setValue, error, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex border rounded-md", className, error && "border-red-500")}
          flagComponent={FlagComponent}
          errorStyle={error && "border-red-500"}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          onChange={(value) => {
            onChange?.(value ? value : null);
          }}
          {...props}
        />
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef(
  ({ className, errorStyle, ...props }, ref) => (
    <Input
      className={cn("rounded-l-none border-0 border-l bg-white disabled:opacity-100", errorStyle)}
      {...props}
      placeholder="20323343499"
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";



const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}) => {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(selectedValue) => onChange(selectedValue)}
    >
      <SelectTrigger className="w-[55px] gap-[2px] h-9 border-none disabled:opacity-100 rounded-r-none bg-white pl-2 pr-1">
        <SelectValue>
          <FlagComponent country={value} countryName={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]" align="start">
        {options
          .filter((x) => x.value)
          .map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <FlagComponent
                  country={option.value}
                  countryName={option.label}
                />
                <span className="text-sm">{option.label}</span>
                <span className="text-muted-foreground text-xs ml-auto">
                  +{RPNInput.getCountryCallingCode(option.value)}
                </span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20  h-4 w-6  overflow-hidden rounded-[3px]">
      {Flag && <Flag style={{ width: '100%', height: '100%' }} title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
