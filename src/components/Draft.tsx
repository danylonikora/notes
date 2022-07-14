import { useState, useEffect, useContext, useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";
import Overlay from "./Overlay";
import TextEditor from "./TextEditor";
import OverlaysContext from "../contexts/OverlaysContext";
import type { NoteT } from "./Note";
import type { draftState } from "../App";
import { addNote, changeNote } from "../store/notesSlice";
import { useAppDispatch } from "../store";

type DraftProps = {
  draft: draftState;
  setDraft: React.Dispatch<React.SetStateAction<draftState>>;
};

function Draft({ draft, setDraft }: DraftProps) {
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
      OverlayContext.mountOverlays(
        setDefaultDraftState,
        containerRef,
        [0, 1],
        "Cancel note editing"
      );
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
        <Overlay id={3} />
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
          handleSave={() => {
            if (
              (!noteFields.html && !noteFields.delta) ||
              (noteFields.html === "<p><br></p>" &&
                JSON.stringify(noteFields.delta) ===
                  JSON.stringify('{"ops":[{"insert":"\\n"}]}'))
            )
              return;

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
          setNotesTags={(newTags: string[]) => {
            setNoteFields((prevFieds) => ({
              ...prevFieds,
              tags: newTags,
            }));
          }}
        />
      </div>
    </div>
  );
}

export default Draft;
