import { createContext } from "react";

export interface IOverlaysContext {
  overlaysProps: {
    overlayedElementRef: React.RefObject<HTMLElement> | undefined;
    handleClick: (() => void) | undefined;
    activeOrverlays: number[];
  };
  showOverlays: boolean;
  mountOverlays: (
    handleClick: IOverlaysContext["overlaysProps"]["handleClick"],
    overlayedElementRef: IOverlaysContext["overlaysProps"]["overlayedElementRef"],
    activeOverlays: IOverlaysContext["overlaysProps"]["activeOrverlays"],
  ) => void;
  unmountOverlays: () => void;
}

const OverlaysContext = createContext<IOverlaysContext>({
  overlaysProps: {
    overlayedElementRef: undefined,
    handleClick: undefined,
    activeOrverlays: [],
  },
  showOverlays: false,
  mountOverlays: () => undefined,
  unmountOverlays: () => undefined,
});

export default OverlaysContext;
