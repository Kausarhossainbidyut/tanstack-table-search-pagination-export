import { useEffect, useState } from "react";

const DebouncedInput = ({
  value: initialValue,
  onChange,        
  debounce = 500,
  ...props       
}) => {
  const [value, setValue] = useState(initialValue);

  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // * 0.5s after set value in state, then call onChange
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onChange) onChange(value);  
    }, debounce);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      
    />
  );
};

export default DebouncedInput;
