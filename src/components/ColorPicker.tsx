import { useEffect, useRef, useContext } from "react";
import OverlaysContext from "../contexts/OverlaysContext";

export const COLORS = [
  { name: "Yellow", hex: "#FFF599" },
  { name: "Brown", hex: "#DCD4D0" },
  { name: "Green", hex: "#BCF0C4" },
  { name: "Pink", hex: "#FAC7D8" },
  { name: "Blue", hex: "#D3E0EE" },
  { name: "Red", hex: "#FFADAD" },
  { name: "Grey", hex: "#E0E0E0" },
  { name: "Orange", hex: "#FFC999" },
  { name: "Purple", hex: "#CDC7E6" },
];

type ColorPickerProps = {
  changeHandler: (value: string) => void;
  hideSelf: () => void;
};

function ColorPicker({ changeHandler, hideSelf }: ColorPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const OverlayContext = useContext(OverlaysContext);

  useEffect(() => {
    OverlayContext.mountOverlays(
      () => hideSelf(),
      containerRef,
      [0, 1, 2],
      "Close color picker"
    );

    return () => {
      OverlayContext.unmountOverlays();
    };
  }, []);

  return (
    <div className="color-picker" ref={containerRef}>
      <button
        className="color-picker__default"
        title="Default"
        onClick={() => changeHandler("")}
      />
      {COLORS.map((color) => (
        <button
          className="color-picker__color"
          key={color.name}
          style={{ backgroundColor: color.hex }}
          title={color.name}
          onClick={() => changeHandler(color.hex)}
        />
      ))}
    </div>
  );
}

export default ColorPicker;
