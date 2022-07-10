import { useState, useEffect, useContext, useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";
import TagsDropDown from "./TagsDropDown";
import Overlay from "./Overlay";
import TextEditor from "./TextEditor";
import { OverlaysContext } from "../App";
import type { NoteT } from "./Note";
import type { draftState } from "../App";
import { addNote, changeNote } from "../store/notesSlice";
import { useAppDispatch } from "../store";

import pencilPng from "../assets/pencil.png";
import plusPng from "../assets/plus.png";
import trashPng from "../assets/trash.png";

type DraftProps = {
  draft: draftState;
  setDraft: React.Dispatch<React.SetStateAction<draftState>>;
};

function Draft({ draft, setDraft }: DraftProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [noteFields, setNoteFields] = useState<NoteT>(draft.note);
  const [isEditorFullSized, setIsEditorFullSized] = useState(false);

  const OverlayContext = useContext(OverlaysContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (isEditorFullSized) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
  }, [isEditorFullSized]);

  return (
    <div className="draft" ref={containerRef}>
      <Overlay id={2} />
      <div className="draft__editor" ref={editorRef}>
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
          handleFullSize={() => {
            const container = editorRef.current;
            if (!container) return;
            if (isEditorFullSized) {
              container.classList.remove("draft__editor--full-size");
            } else {
              container.classList.add("draft__editor--full-size");
            }
            setIsEditorFullSized((prev) => !prev);
          }}
          isFullSized={isEditorFullSized}
        />
        <div className="draft__btns">
          <button
            className="draft__btn"
            onClick={() => {
              if (draft.mode === "creating") {
                dispatch(addNote({ ...noteFields, last_update: Date.now() }));
              } else {
                dispatch(
                  changeNote({
                    id: noteFields.id,
                    fields: {
                      html: noteFields.html,
                      delta: noteFields.delta,
                      tags: noteFields.tags,
                    },
                  })
                );
              }

              setDefaultDraftState();
            }}
          >
            <span>{draft.mode === "editing" ? "Save" : "Add"} note</span>
            <img className="draft__icon" src={plusPng} />
          </button>
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
                  setNoteFields((prevFieds) => ({
                    ...prevFieds,
                    tags: newTags,
                  }));
                }}
                activeTags={noteFields.tags}
              />
            )}
          </div>
          {/* <button className="draft__btn" onClick={() => setDefaultDraftState()}>
            <span>Clear</span>
            <img className="note__icon" src={trashPng} />
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Draft;
