import { useState, useRef, useEffect, useContext } from "react";
import { OverlaysContext } from "../App";
import { useAppSelector } from "../store";
import { selectTags } from "../store/tagsSlice";

import checkPng from "../assets/check.png";

type TagsDropDownProps = {
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  hideSelf: () => void;
  activeOverlays: number[];
};

function TagsDropDown({
  activeTags,
  setActiveTags,
  hideSelf,
  activeOverlays,
}: TagsDropDownProps) {
  const [editingTags, setEditingTags] = useState(activeTags);
  const tags = useAppSelector(selectTags);

  const containerRef = useRef<HTMLUListElement>(null);

  const OverlayContext = useContext(OverlaysContext);

  useEffect(() => {
    OverlayContext.mountOverlays(
      () => hideSelf(),
      containerRef,
      activeOverlays
    );

    return () => {
      OverlayContext.unmountOverlays();
    };
  }, []);

  return (
    <ul className="tags-dropdown" ref={containerRef}>
      {[...tags].map((tag) => (
        <li
          className="tags-dropdown__tag"
          key={tag}
          onClick={() =>
            setEditingTags((prevTags) => {
              if (editingTags.includes(tag)) {
                return prevTags.filter((prevTag) => prevTag !== tag);
              }
              return [...prevTags, tag];
            })
          }
        >
          <span>{tag}</span>
          <div className="tags-dropdown__checkbox">
            {editingTags.includes(tag) && (
              <img className="tags-dropdown__check" src={checkPng} />
            )}
          </div>
        </li>
      ))}
      <li className="tags-dropdown__save-btn-container">
        <button
          className="tags-dropdown__save-btn"
          onClick={() => {
            setActiveTags(editingTags);
            hideSelf();
          }}
        >
          Save
        </button>
      </li>
    </ul>
  );
}

export default TagsDropDown;
