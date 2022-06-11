import { useState, useEffect, useContext, useRef } from "react";
import { nanoid } from "nanoid";
import TagsDropDown from "./TagsDropDown";
import Overlay from "./Overlay";
import TextEditor from "./TextEditor";
import { OverlaysContext } from "../App";
import type { NoteT } from "./Note";
import type { draftState } from "../App";

import pencilPng from "../assets/pencil.png";
import plusPng from "../assets/plus.png";

type DraftProps = {
  draft: draftState;
  setDraft: React.Dispatch<React.SetStateAction<draftState>>;
  addNote: (note: NoteT) => void;
  setNoteHTMLDeltaAndTags:
    | ((html: string, delta: string, tags: string[]) => void)
    | undefined;
  allTags: string[];
};

function Draft({
  draft,
  setDraft,
  addNote,
  setNoteHTMLDeltaAndTags,
  allTags,
}: DraftProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [noteFields, setNoteFields] = useState<NoteT>(draft.note);

  const OverlayContext = useContext(OverlaysContext);
  const containerRef = useRef<HTMLDivElement>(null);

  function setDefaultDraftState() {
    setDraft({
      mode: "creating",
      note: {
        id: nanoid(),
        html: "",
        delta: "",
        tags: [],
        last_update: Date.now(),
      },
    });
  }

  useEffect(() => {
    setNoteFields(draft.note);

    if (draft.mode === "editing") {
      OverlayContext.mountOverlays(setDefaultDraftState, containerRef, [0, 1]);
    } else {
      OverlayContext.unmountOverlays();
    }
  }, [draft]);

  return (
    <div className="draft" ref={containerRef}>
      <Overlay id={2} />
      <div className="note__edit-tags-dropdown">
        <button
          className="note__edit-btn note__btn"
          onClick={() => setIsEditingTags(true)}
        >
          <span>Edit tags</span>
          <img className="note__icon" src={pencilPng} />
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
      <TextEditor
        note={draft.note}
        mode={draft.mode}
        setNotesHTMLAndDelta={(html, delta) =>
          setNoteFields((prevFields) => ({
            ...prevFields,
            html,
            delta,
          }))
        }
      />
      <button
        className="draft__add-note-btn"
        onClick={() => {
          if (draft.mode === "creating") {
            addNote({ ...noteFields, last_update: Date.now() });
          } else if (setNoteHTMLDeltaAndTags) {
            setNoteHTMLDeltaAndTags(
              noteFields.html,
              noteFields.delta,
              noteFields.tags
            );
          }

          setDefaultDraftState();
        }}
      >
        <span>{draft.mode === "editing" ? "Save" : "Add"} note</span>
        <img className="draft__icon" src={plusPng} />
      </button>
    </div>
  );
}

export default Draft;
