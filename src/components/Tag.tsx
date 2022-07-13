import { useState, useRef } from "react";
import OverflowField from "./OverflowField";
import { useAppDispatch } from "../store";
import { removeTag, renameTag } from "../store/tagsSlice";
import { updateNotesTag, removeTagFromNotes } from "../store/notesSlice";

import pencilPng from "../assets/pencil.png";
import trashPng from "../assets/trash.png";

type TagProps = {
  amountOfNotes: number;
  tag: string;
  isActive: boolean;
  setTag: (tag: string) => void;
};

function Tag({ amountOfNotes, tag, isActive, setTag }: TagProps) {
  const [isRenaming, setIsRenaming] = useState(false);

  const liRef = useRef<HTMLLIElement>(null);
  const dispatch = useAppDispatch();

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
            dispatch(removeTag(tag));
            dispatch(removeTagFromNotes(tag));
          }}
        />
      </div>
      {isRenaming && (
        <OverflowField
          value={tag}
          setValue={(newName) => {
            dispatch(renameTag({ name: tag, newName }));
            dispatch(updateNotesTag({ oldTagName: tag, newTagName: newName }));
          }}
          hideSelf={() => setIsRenaming(false)}
          overflowedElement={liRef.current}
        />
      )}
    </li>
  );
}

export default Tag;
