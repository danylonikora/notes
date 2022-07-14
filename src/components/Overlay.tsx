import { useEffect, useRef, useContext } from "react";
import OverlaysContext from "../contexts/OverlaysContext";

type OverlayProps = { id: number; title?: string };

// In order to overlay entire page Overlay components
// have to be present in every stacking context; docs -
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

function Overlay({ id }: OverlayProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const OverlayContext = useContext(OverlaysContext);
  const { showOverlays } = OverlayContext;
  const { handleClick, overlayedElementRef, activeOrverlays, title } =
    OverlayContext.overlaysProps;

  useEffect(() => {
    if (!divRef.current || !overlayedElementRef?.current) return;

    // <Overlay's /> z-index is set to 998 in scss
    overlayedElementRef.current.style.zIndex = "999";

    return () => {
      if (!overlayedElementRef?.current) return;
      overlayedElementRef.current.style.zIndex = "";
    };
  });

  return showOverlays && activeOrverlays.includes(id) ? (
    <div
      className="overlay"
      ref={divRef}
      title={title}
      onClick={() => (handleClick ? handleClick() : false)}
    ></div>
  ) : (
    <></>
  );
}

export default Overlay;
