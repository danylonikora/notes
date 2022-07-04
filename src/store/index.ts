import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import notesReducer from "./notesSlice";
import tagsReducer from "./tagsSlice";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    tags: tagsReducer,
  },
});

store.subscribe(() => {
  const { notes, tags } = store.getState();
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("tags", JSON.stringify(tags));
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
