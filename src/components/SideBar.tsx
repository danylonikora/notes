import { useState } from "react";
import Tag from "./Tag";
import Overlay from "./Overlay";
import type { FiltersT } from "../App";
import { useAppSelector, useAppDispatch } from "../store";
import { selectNotes } from "../store/notesSlice";
import { addTag, selectTags } from "../store/tagsSlice";

import plusPng from "../assets/plus.png";

type SideBarProps = {
  filters: FiltersT;
  setTag: (tag: string) => void;
  setIncludes: (string: string) => void;
  setSort: (order: FiltersT["sort"]) => void;
};

function SideBar({ filters, setTag, setIncludes, setSort }: SideBarProps) {
  const [newTagField, setNewTagField] = useState("");
  const notes = useAppSelector(selectNotes);
  const tags = useAppSelector(selectTags);
  const dispatch = useAppDispatch();

  return (
    <div className="side-bar">
      <Overlay id={0} />
      <h3 className="side-bar__logo">Notes</h3>
      <div className="filters">
        <input
          className="filters__search"
          placeholder="Search by text"
          onChange={(e) => setIncludes(e.target.value)}
        />
        <div className="filters__sort">
          <span>Sort: </span>
          <span
            className={`pointer${
              filters.sort === "ascending" ? " active" : ""
            }`}
            onClick={() => setSort("ascending")}
          >
            ascending
          </span>
          <span> | </span>
          <span
            className={`pointer${
              filters.sort === "descending" ? " active" : ""
            }`}
            onClick={() => setSort("descending")}
          >
            descending
          </span>
        </div>
      </div>
      <h3 className="tags-heading">Tags</h3>
      <ul className="tags">
        <li
          className={`tag${!filters.tag ? " active" : ""}`}
          onClick={() => setTag("")}
        >
          <span>All ({notes.length})</span>
        </li>
        {tags.map((tag) => (
          <Tag
            key={tag}
            amountOfNotes={
              notes.filter((note) => note.tags.includes(tag)).length
            }
            tag={tag}
            isActive={filters.tag === tag}
            setTag={setTag}
          />
        ))}
        <li>
          <input
            className="tags__new-tag-field"
            value={newTagField}
            placeholder="New tag"
            onChange={(e) => setNewTagField(e.target.value)}
          />
        </li>
        <li
          className="tags__add-btn-container"
          tabIndex={0}
          onClick={() => {
            dispatch(addTag(newTagField));
            setNewTagField("");
          }}
        >
          <button className="tags__add-btn" tabIndex={-1}>
            <img className="tags__add-icon" src={plusPng} />
            <span>Add tag</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
