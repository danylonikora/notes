import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";

const initialState: string[] = JSON.parse(localStorage.getItem("tags") || "[]");

export const tagsSlice = createSlice({
  initialState,
  name: "tags",
  reducers: {
    addTag(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (state.includes(name)) return;
      state.push(name);
    },
    removeTag(state, action: PayloadAction<string>) {
      return state.filter((tag) => tag !== action.payload);
    },
    renameTag(state, action: PayloadAction<{ name: string; newName: string }>) {
      const { name, newName } = action.payload;
      if (!state.includes(name)) return;
      state[state.indexOf(name)] = newName;
    },
  },
});

export const { addTag, removeTag, renameTag } = tagsSlice.actions;

export const selectTags = (state: RootState) => state.tags;

export default tagsSlice.reducer;
