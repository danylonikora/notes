import { useEffect, useRef, useContext } from "react";
import { OverlaysContext } from "../App";

export type OverlayProps = {
  overlayedElementRef: React.MutableRefObject<HTMLElement> | undefined;
  handleClick: (() => void) | undefined;
  activeOrverlays: number[];
};

// In order to overlay entire page Overlay components
// have to be present in every stacking context; docs -
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context

function Overlay({ id }: { id: number }) {
  const divRef = useRef();
  const OverlayContext = useContext(OverlaysContext);
  const { handleClick, overlayedElementRef, activeOrverlays } =
    OverlayContext.overlaysProps;

  useEffect(() => {
    if (!divRef.current || !overlayedElementRef?.current) return;

    // <Overlay's /> z-index is set to 998 in scss
    overlayedElementRef.current.style.zIndex = "999";

    return () => {
      if (!overlayedElementRef?.current) return;
      delete overlayedElementRef.current.style.zIndex;
    };
  });

  return OverlayContext.showOverlays &&
    OverlayContext.overlaysProps.activeOrverlays.includes(id) ? (
    <div
      className="overlay"
      ref={divRef}
      onClick={() => (handleClick ? handleClick() : false)}
    ></div>
  ) : (
    <></>
  );
}

export default Overlay;
