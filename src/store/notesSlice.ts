import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NoteT } from "../components/Note";
import { RootState } from "./index";

type hello = {};

type NotesState = NoteT[];

const initialState: NotesState = JSON.parse(
  localStorage.getItem("notes") || "[]"
);

export const notesSlice = createSlice({
  initialState,
  name: "notes",
  reducers: {
    addNote(state, action: PayloadAction<NoteT>) {
      state.push(action.payload);
    },
    removeNote(state, action: PayloadAction<NoteT["id"]>) {
      return state.filter((note) => note.id !== action.payload);
    },
    changeNote(
      state,
      action: PayloadAction<{
        id: NoteT["id"];
        fields: {
          [Property in keyof NoteT as Exclude<
            Property,
            "id"
          >]?: NoteT[Property];
        };
      }>
    ) {
      const { id, fields } = action.payload;
      const note = state.find((note) => note.id === id);
      if (!note) return;
      const noteKeys = Object.keys(note) as (keyof NoteT)[];

      if (
        noteKeys.every((key) => {
          if (key in fields) {
            return fields[key] === note[key];
          }
          return true;
        }) // Return if values didn't change. Only shallow comparison.
      )
        return;

      for (let key in fields) {
        note[key] = fields[key];
      }
      note.last_update = Date.now();
    },
    updateNotesTag(
      state,
      action: PayloadAction<{ oldTagName: string; newTagName: string }>
    ) {
      const { oldTagName, newTagName } = action.payload;
      state.forEach((note) => {
        if (note.tags.includes(oldTagName)) {
          note.tags[note.tags.indexOf(oldTagName)] = newTagName;
        }
      });
    },
  },
});

export const { addNote, removeNote, changeNote, updateNotesTag } =
  notesSlice.actions;

export const selectNotes = (state: RootState) => state.notes;

export default notesSlice.reducer;
