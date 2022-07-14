import { useRef } from "react";
import type { draftState } from "../App";
import { useAppDispatch } from "../store";
import { removeNote } from "../store/notesSlice";

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

  function formatLastUpdateTime() {
    const now = new Date();
    const lastUpdate = new Date(data.last_update);
    const timeOfLastUpdate = lastUpdate.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (now.toDateString() === lastUpdate.toDateString()) {
      return `Today at ${timeOfLastUpdate}`;
    } else {
      return `${lastUpdate.toLocaleDateString("uk-UA")} at ${timeOfLastUpdate}`;
    }
  }

  return (
    <>
      <div className="note">
        <div className="note__date-and-btns-container">
          <time
            className="note__date"
            dateTime={new Date(Date.now()).toISOString()}
          >
            {formatLastUpdateTime()}
          </time>
          <div className="note__btns">
            <button
              className="note__edit-btn note__btn"
              title="Edit note"
              onClick={() => {
                setDraft({ mode: "editing", note: data });
              }}
            />
            <button
              className="note__delete-btn note__btn"
              title="Delete note"
              onClick={() => {
                dispatch(removeNote(data.id));
              }}
            />
          </div>
        </div>
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
      </div>
    </>
  );
}

export default Note;
