import React, { useState, useEffect, createContext } from "react";
import { nanoid } from "nanoid";
import Note, { NoteT } from "./components/Note";
import SideBar from "./components/SideBar";
import Draft from "./components/Draft";
import Overlay, { OverlayProps } from "./components/Overlay";

export type FiltersT = {
  sort: "ascending" | "descending";
  includes: string;
  tag: string;
};

type OverlaysContextProps = {
  overlaysProps: OverlayProps;
  showOverlays: boolean;
  mountOverlays: (
    handleClick: OverlayProps["handleClick"],
    overlayedElementRef: OverlayProps["overlayedElementRef"],
    activeOverlays: OverlayProps["activeOrverlays"]
  ) => void;
  unmountOverlays: () => void;
};

export const OverlaysContext = createContext<OverlaysContextProps>({
  overlaysProps: {
    overlayedElementRef: undefined,
    handleClick: undefined,
    activeOrverlays: [],
  },
  showOverlays: false,
  mountOverlays: () => undefined,
  unmountOverlays: () => undefined,
});

export type draftState = {
  mode: "editing" | "creating";
  note: NoteT;
};

function App() {
  const [notes, setNotes] = useState<NoteT[]>(
    JSON.parse(localStorage.getItem("notes")) || []
  );
  const [tags, setTags] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("tags")) || [])
  );
  const [filters, setFilters] = useState<FiltersT>({
    sort: "ascending",
    includes: "",
    tag: "",
  });
  const [showOverlays, setShowOverlays] = useState(false);
  const [overlaysProps, setOverlaysProps] = useState<OverlayProps>({
    overlayedElementRef: undefined,
    handleClick: undefined,
    activeOrverlays: [],
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

  function getNoteById(id: NoteT["id"]) {
    const note = notes.find((note) => note.id === id);
    if (!note) {
      throw new Error(`Note with id '${id}' doesn't exist`);
    }
    return note;
  }

  function changeNoteDecorator(id: NoteT["id"], fields: (keyof NoteT)[]) {
    const note = getNoteById(id);

    return function (...newValues: any[]) {
      // Only shallow comparison, if field required object
      // newValue has to be new object in order to update note
      if (
        Object.keys(note).every((field) =>
          fields.includes(field)
            ? newValues[field.indexOf(field)] === note[field]
            : true
        )
      )
        return;

      setNotes((prevNotes) => [
        ...prevNotes.filter((note) => note.id !== id),
        {
          ...note,
          ...fields.reduce(
            (prev, curr, i) => ({ ...prev, [curr]: newValues[i] }),
            {}
          ),
          last_update: Date.now(),
        },
      ]);
    };
  }

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify([...tags]));
  }, [tags]);

  useEffect(() => {
    if (showOverlays) {
      disableBodyScroll(true);
    } else {
      enableBodyScroll();
    }
  }, [showOverlays]);

  function enableBodyScroll() {
    if (document.readyState === "complete") {
      document.body.style.position = "";
      document.body.style.overflowY = "";

      if (document.body.style.marginTop) {
        const scrollTop = -parseInt(document.body.style.marginTop, 10);
        document.body.style.marginTop = "";
        window.scrollTo(window.pageXOffset, scrollTop);
      }
    } else {
      window.addEventListener("load", enableBodyScroll);
    }
  }

  function disableBodyScroll(savePosition = false) {
    if (document.readyState === "complete") {
      if (document.body.scrollHeight > window.innerHeight) {
        if (savePosition)
          document.body.style.marginTop = `-${window.pageYOffset}px`;
        document.body.style.position = "fixed";
        document.body.style.overflowY = "scroll";
      }
    } else {
      window.addEventListener("load", () => disableBodyScroll(savePosition));
    }
  }

  return (
    <OverlaysContext.Provider
      value={{
        overlaysProps,
        showOverlays,
        mountOverlays(handleClick, overlayedElementRef, activeOrverlays) {
          setOverlaysProps({
            handleClick,
            overlayedElementRef,
            activeOrverlays,
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
          notes={notes}
          tags={[...tags]}
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
          addTag={(tag) => setTags((prevTags) => new Set([...prevTags, tag]))}
          deleteTag={(tag) =>
            setTags((prevTags) => {
              const newTags = new Set([...prevTags].filter((t) => t !== tag));
              setNotes((prevNotes) =>
                prevNotes.map((note) => {
                  if (note.tags.includes(tag)) {
                    note.tags = note.tags.filter((t) => t !== tag);
                  }
                  return note;
                })
              );
              return newTags;
            })
          }
          renameTag={(tag, newName) =>
            setTags((prevTags) => {
              const newTags = new Set(
                [...prevTags].map((t) => (t === tag ? newName : t))
              );
              setNotes((prevNotes) =>
                prevNotes.map((note) => {
                  if (note.tags.includes(tag)) {
                    note.tags[note.tags.indexOf(tag)] = newName;
                  }
                  return note;
                })
              );
              return newTags;
            })
          }
        />
        <div className="notes">
          <Overlay id={1} />
          {applyFilters(notes).map((note) => (
            <Note
              key={note.id}
              data={note}
              setDraft={setDraft}
              deleteNote={(id) => {
                // getNoteById will throw error if it won't find note with given id
                getNoteById(id);
                setNotes((prevNotes) => [
                  ...prevNotes.filter((note) => note.id !== id),
                ]);
              }}
            />
          ))}
          {notes.length === 0 && "You don't have notes"}
        </div>
        <Draft
          draft={draft}
          setNoteHTMLDeltaAndTags={
            draft.mode === "editing"
              ? changeNoteDecorator(draft.note.id, ["html", "delta", "tags"])
              : undefined
          }
          setDraft={setDraft}
          addNote={(note) => setNotes((prevNotes) => [...prevNotes, note])}
          allTags={[...tags]}
        />
      </div>
    </OverlaysContext.Provider>
  );
}

export default App;
