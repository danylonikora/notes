import { useState, useRef } from "react";
import TagsDropdown from "./TagsDropDown";
import OverflowField from "./OverflowField";

import pencilPng from "../assets/pencil.png";
import trashPng from "../assets/trash.png";

export type NoteT = {
  id: string;
  text: string;
  tags: string[];
  last_update: number;
};

type NoteProps = {
  data: NoteT;
  setText: (text: NoteT["text"]) => void;
  deleteNote: (id: NoteT["id"]) => void;
  setTags: (tags: NoteT["tags"]) => void;
  allTags: string[];
};

function Note({ data, setText, deleteNote, setTags, allTags }: NoteProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);

  const preRef = useRef<HTMLPreElement>();

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
          <li className="note__edit-tags-dropdown">
            <button
              className="note__edit-btn note__btn"
              onClick={() => setIsEditingTags(true)}
            >
              <span>Edit tags</span>
              <img className="note__icon" src={pencilPng} />
            </button>
            {isEditingTags && (
              <TagsDropdown
                hideSelf={() => setIsEditingTags(false)}
                setActiveTags={setTags}
                activeTags={data.tags}
                allTags={allTags}
              />
            )}
          </li>
        </ul>
        <span className="note__text" ref={preRef}>
          {data.text}
          {isEditingText && (
            <OverflowField
              value={data.text}
              setValue={setText}
              hideSelf={() => setIsEditingText(false)}
              overflowedElement={preRef.current}
            />
          )}
        </span>
        <div className="note__btns">
          <button
            className="note__edit-btn note__btn"
            onClick={() => {
              setIsEditingText((prev) => true);
            }}
          >
            <span>Edit text</span>
            <img className="note__icon" src={pencilPng} />
          </button>
          <button
            className="note__delete-btn note__btn"
            onClick={() => {
              deleteNote(data.id);
            }}
          >
            <span>Delete note</span>
            <img className="note__icon" src={trashPng} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Note;
