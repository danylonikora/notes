import { useState, useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";
import Note, { NoteT } from "./components/Note";
import SideBar from "./components/SideBar";
import Draft from "./components/Draft";
import Overlay from "./components/Overlay";
import { useAppSelector } from "./store";
import { selectNotes } from "./store/notesSlice";
import { enableBodyScroll, disableBodyScroll } from "./utils/bodyScroll";
import OverlaysContext, { IOverlaysContext } from "./contexts/OverlaysContext";

export type FiltersT = {
  sort: "ascending" | "descending";
  includes: string;
  tag: string;
};

export type draftState = {
  mode: "editing" | "creating";
  note: NoteT;
};

function App() {
  const notes = useAppSelector(selectNotes);
  const [filters, setFilters] = useState<FiltersT>({
    sort: "descending",
    includes: "",
    tag: "",
  });
  const [showOverlays, setShowOverlays] = useState(false);
  const [overlaysProps, setOverlaysProps] = useState<
    IOverlaysContext["overlaysProps"]
  >({
    overlayedElementRef: undefined,
    handleClick: undefined,
    activeOrverlays: [],
    title: undefined,
  });
  const [draft, setDraft] = useState<draftState>({
    mode: "creating",
    note: {
      id: nanoid(),
      html: "",
      delta: "",
      tags: [],
      last_update: Date.now(),
    },
  });

  function applyFilters(notes: NoteT[]) {
    let filteredNotes = [...notes];

    if (filters.tag) {
      filteredNotes = filteredNotes.filter((note) =>
        note.tags.includes(filters.tag)
      );
    }

    if (filters.includes) {
      filteredNotes = filteredNotes.filter((note) => {
        const div = document.createElement("div");
        div.innerHTML = note.html;
        const regExp = new RegExp(filters.includes, "iu");
        return div.textContent && div.textContent.match(regExp);
      });
    }

    filteredNotes.sort((a, b) => {
      if (filters.sort === "ascending") return a.last_update - b.last_update;
      return b.last_update - a.last_update;
    });

    return filteredNotes;
  }

  useEffect(() => {
    if (showOverlays) {
      disableBodyScroll(true);
    } else {
      enableBodyScroll();
    }
  }, [showOverlays]);

  return (
    <OverlaysContext.Provider
      value={{
        overlaysProps,
        showOverlays,
        mountOverlays(
          handleClick,
          overlayedElementRef,
          activeOrverlays,
          title
        ) {
          setOverlaysProps({
            handleClick,
            overlayedElementRef,
            activeOrverlays,
            title,
          });
          setShowOverlays(true);
        },
        unmountOverlays() {
          setShowOverlays(false);
        },
      }}
    >
      <div className="page-container">
        <SideBar
          filters={filters}
          setTag={(tag) =>
            setFilters((prevFilters) => ({ ...prevFilters, tag }))
          }
          setIncludes={(string) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              includes: string,
            }))
          }
          setSort={(order) =>
            setFilters((prevFilters) => ({ ...prevFilters, sort: order }))
          }
        />
        <div className="notes">
          <Overlay id={1} />
          {(() => {
            if (notes.length === 0) return "You don't have notes.";

            const filteredNotes = applyFilters(notes).map((note) => (
              <Note key={note.id} data={note} setDraft={setDraft} />
            ));

            switch (true) {
              case filteredNotes.length > 0:
                return filteredNotes;
              case filters.tag &&
                notes.filter((note) => {
                  return note.tags.includes(filters.tag);
                }).length === 0:
                return "You don't have notes with this tag.";
              case Boolean(filters.includes):
                return "Notes that contain searched text weren't found.";
            }
          })()}
        </div>
        <Draft draft={draft} setDraft={setDraft} />
      </div>
    </OverlaysContext.Provider>
  );
}

export default App;
