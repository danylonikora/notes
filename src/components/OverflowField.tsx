import { useState, useRef, useEffect, useContext } from "react";
import { OverlaysContext } from "../App";

type OverflowFieldProps = {
  value: string;
  setValue: (value: string) => void;
  hideSelf: () => void;
  overflowedElement: HTMLElement | null;
};

function OverflowField({
  value,
  setValue,
  hideSelf,
  overflowedElement,
}: OverflowFieldProps) {
  const [field, setField] = useState(value);

  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const OverlayContext = useContext(OverlaysContext);

  useEffect(() => {
    if (!overflowedElement) return;

    OverlayContext.mountOverlays(() => hideSelf(), containerRef, [0, 1, 2]);

    if (!fieldRef.current) return;
    const { width } = overflowedElement.getBoundingClientRect();
    fieldRef.current.style.width = width + "px";

    return () => {
      OverlayContext.unmountOverlays();
    };
  }, []);

  useEffect(() => {
    if (!fieldRef.current) return;
    const { scrollHeight } = fieldRef.current;
    fieldRef.current.style.height = scrollHeight + "px";
  }, [field]);

  return (
    <>
      <div
        className="overflow-field"
        ref={containerRef}
        onClick={(e) => {
          console.log("click on me");
          e.stopPropagation();
        }}
      >
        <textarea
          className="overflow-field__field"
          ref={fieldRef}
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <button
          className="overflow-field__save-btn"
          onClick={() => {
            setValue(field);
            hideSelf();
          }}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default OverflowField;
