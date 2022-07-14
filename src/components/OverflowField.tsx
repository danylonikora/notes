import { useState, useRef, useEffect, useContext } from "react";
import OverlaysContext from "../contexts/OverlaysContext";

type OverflowFieldProps = {
  value: string;
  setValue: (value: string) => void;
  hideSelf: () => void;
  overflowedElement: HTMLElement | null;
  placeholder: string;
  hideSelfTitle: string;
};

function OverflowField({
  value,
  setValue,
  hideSelf,
  overflowedElement,
  placeholder,
  hideSelfTitle,
}: OverflowFieldProps) {
  const [field, setField] = useState(value);

  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const OverlayContext = useContext(OverlaysContext);

  useEffect(() => {
    if (!overflowedElement) return;
    OverlayContext.mountOverlays(
      () => hideSelf(),
      containerRef,
      [0, 1, 2],
      hideSelfTitle
    );

    if (!fieldRef.current) return;
    fieldRef.current.focus();

    return () => {
      OverlayContext.unmountOverlays();
    };
  }, []);

  return (
    <div
      className="overflow-field"
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <textarea
        className="overflow-field__field"
        ref={fieldRef}
        value={field}
        onChange={(e) => setField(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => {
          e.target.selectionStart = e.target.selectionEnd =
            e.target.value.length; // Set selection to the end
        }}
      />
      <button
        className="overflow-field__save-btn"
        onClick={() => {
          if (field) {
            setValue(field);
            hideSelf();
          }
        }}
      >
        Save
      </button>
    </div>
  );
}

export default OverflowField;
