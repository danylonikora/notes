import { useEffect, useState } from "react";
import Quill from "quill";
import type { draftState } from "../App";
import type { NoteT } from "./Note";

type TextEditorProps = {
  setNotesHTMLAndDelta: (html: string, delta: string) => void;
  note: NoteT;
  mode: draftState["mode"];
};

function TextEditor({ setNotesHTMLAndDelta, note, mode }: TextEditorProps) {
  const [quill, setQuill] = useState<Quill | undefined>();

  useEffect(() => {
    const quill = new Quill(".text-editor__text-area", {
      formats: ["bold", "italic", "underline", "strike", "list"],
      modules: {
        toolbar: ".text-editor__toolbar",
      },
    });

    quill.on("text-change", () => {
      const editor = document.querySelector(".ql-editor");
      if (editor) {
        setNotesHTMLAndDelta(
          editor.innerHTML,
          JSON.stringify(quill.getContents())
        );
      }
    });

    setQuill(quill);
  }, []);

  useEffect(() => {
    if (!quill) return;
    if (mode === "editing") {
      quill.setContents(JSON.parse(note.delta));
    } else {
      quill.deleteText(0, quill.getLength());
    }
  }, [mode, quill, note]);

  return (
    <div className="text-editor rich-text">
      <div className="text-editor__toolbar">
        <button className="ql-bold button" title="Bold (Ctrl+B)" />
        <button className="ql-italic button" title="Italic (Ctrl+I)" />
        <button className="ql-underline button" title="Underline (Ctrl+U)" />
        <button className="ql-strike button" title="Strikethrough" />
        <button
          className="ql-list bulleted-list button"
          value="bullet"
          title="Bulleted list"
        />
        <button
          className="ql-list numbered-list button"
          value="ordered"
          title="Numbered list"
        />
      </div>
      <div className="text-editor__text-area"></div>
    </div>
  );
}

export default TextEditor;
