import { useRef } from "react";
import type { draftState } from "../App";
import { useAppDispatch } from "../store";
import { removeNote } from "../store/notesSlice";

import pencilPng from "../assets/pencil.png";
import trashPng from "../assets/trash.png";

export type NoteT = {
  readonly id: string;
  html: string;
  delta: string;
  tags: string[];
  last_update: number;
};

type NoteProps = {
  data: NoteT;
  setDraft: React.Dispatch<React.SetStateAction<draftState>>;
};

function Note({ data, setDraft }: NoteProps) {
  const noteContentRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="note">
        <time
          className="note__date"
          dateTime={new Date(Date.now()).toISOString()}
        >
          {Date.now() - data.last_update > 1000 * 60 * 60 * 12
            ? new Date(data.last_update).toLocaleDateString("uk-UA")
            : `${("0" + new Date(data.last_update).getHours()).slice(-2)}:${(
                "0" + new Date(data.last_update).getMinutes()
              ).slice(-2)}`}
        </time>
        <ul className="note__tags">
          {data.tags.map((tag) => (
            <li className="note__tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
        <div
          className="note__text rich-text"
          ref={noteContentRef}
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
        <div className="note__btns">
          <button
            className="note__edit-btn note__btn"
            onClick={() => {
              setDraft({ mode: "editing", note: data });
            }}
          >
            <span>Edit</span>
            <img className="note__icon" src={pencilPng} />
          </button>
          <button
            className="note__delete-btn note__btn"
            onClick={() => {
              dispatch(removeNote(data.id));
            }}
          >
            <span>Delete</span>
            <img className="note__icon" src={trashPng} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Note;
