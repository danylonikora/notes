import { useState } from "react";
import Tag from "./Tag";
import type { FiltersT } from "../App";

import plusPng from "../assets/plus.png";

type SideBarProps = {
  tags: string[];
  filters: FiltersT;
  setTag: (tag: string) => void;
  setIncludes: (string: string) => void;
  setSort: (order: FiltersT["sort"]) => void;
  addTag: (tag: string) => void;
  deleteTag: (tag: string) => void;
  renameTag: (tag: string, newName: string) => void;
};

function SideBar({
  tags,
  filters,
  setTag,
  setIncludes,
  setSort,
  addTag,
  deleteTag,
  renameTag,
}: SideBarProps) {
  const [newTagField, setNewTagField] = useState("");

  return (
    <div className="side-bar">
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
          All
        </li>
        {tags.map((tag) => (
          <Tag
            tag={tag}
            isActive={filters.tag === tag}
            setTag={setTag}
            deleteTag={deleteTag}
            renameTag={renameTag}
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
        <li className="tags__add-btn-container">
          <button
            className="tags__add"
            onClick={() => {
              addTag(newTagField);
              setNewTagField("");
            }}
          >
            <img className="tags__add-icon" src={plusPng} />
            <span>Add tag</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
