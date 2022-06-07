import { useState, useRef } from "react";
import OverflowField from "./OverflowField";

import pencilPng from "../assets/pencil.png";
import trashPng from "../assets/trash.png";

type TagProps = {
  amountOfNotes: number;
  tag: string;
  isActive: boolean;
  setTag: (tag: string) => void;
  deleteTag: (tag: string) => void;
  renameTag: (tag: string, newName: string) => void;
};

function Tag({
  amountOfNotes,
  tag,
  isActive,
  setTag,
  deleteTag,
  renameTag,
}: TagProps) {
  const [isRenaming, setIsRenaming] = useState(false);

  const liRef = useRef<HTMLLIElement>();

  return (
    <li
      className={`tag${isActive ? " active" : ""}`}
      ref={liRef}
      onClick={() => setTag(tag)}
    >
      <span>
        {tag} ({amountOfNotes})
      </span>
      <div className="tag__buttons">
        <img
          className="tag__button"
          src={pencilPng}
          title="Rename tag"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
          }}
        />
        <img
          className="tag__button"
          src={trashPng}
          title="Delete tag"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            deleteTag(tag);
          }}
        />
      </div>
      {isRenaming && (
        <OverflowField
          value={tag}
          setValue={(newName) => renameTag(tag, newName)}
          hideSelf={() => setIsRenaming(false)}
          overflowedElement={liRef.current}
        />
      )}
    </li>
  );
}

export default Tag;
