import { useState } from "react";
import { nanoid } from "nanoid";
import TagsDropDown from "./TagsDropDown";
import type { NoteT } from "./Note";

type DraftProps = {
  addNote: (note: NoteT) => void;
  allTags: string[];
};

function Draft({ addNote, allTags }: DraftProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [noteFields, setNoteFields] = useState<NoteT>({
    id: nanoid(),
    text: "",
    tags: [],
    last_update: Date.now(),
  });

  return (
    <div className="draft">
      <div className="note__edit-tags-dropdown">
        <button
          className="note__edit-btn note__btn"
          onClick={() => setIsEditingTags(true)}
        >
          <span>Edit tags</span>
          <img
            className="note__icon"
            src={new URL("../assets/pencil.png", import.meta.url)}
          />
        </button>
        {isEditingTags && (
          <TagsDropDown
            hideSelf={() => setIsEditingTags(false)}
            setActiveTags={(newTags: string[]) => {
              setNoteFields((prevFieds) => ({ ...prevFieds, tags: newTags }));
            }}
            activeTags={noteFields.tags}
            allTags={allTags}
          />
        )}
      </div>
      <textarea
        id="text"
        className="draft__text"
        name="text"
        value={noteFields.text}
        onChange={(e) =>
          setNoteFields((prevFields) => ({
            ...prevFields,
            text: e.target.value,
          }))
        }
        autoComplete="off"
      />
      <button
        className="draft__add-note-btn"
        onClick={() => {
          addNote({ ...noteFields, last_update: Date.now() });
          setNoteFields({
            id: nanoid(),
            text: "",
            tags: [],
            last_update: Date.now(),
          });
        }}
      >
        <span>Add note</span>
        <img
          className="draft__icon"
          src={new URL("../assets/plus.png", import.meta.url)}
        />
      </button>
    </div>
  );
}

export default Draft;
