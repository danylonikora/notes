import { useEffect, useState, useRef } from "react";
import Quill from "quill";
import ColorPicker, { COLORS } from "./ColorPicker";
import type { draftState } from "../App";
import type { NoteT } from "./Note";

type TextEditorProps = {
  setNotesHTMLAndDelta: (html: string, delta: string) => void;
  note: NoteT;
  mode: draftState["mode"];
  handleFullSize: () => void;
  isFullSized: boolean;
};

function TextEditor({
  setNotesHTMLAndDelta,
  note,
  mode,
  handleFullSize,
  isFullSized,
}: TextEditorProps) {
  const [quill, setQuill] = useState<Quill | undefined>();
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTxtColorPicker, setShowTxtColorPicker] = useState(false);

  const bgColorSelectRef = useRef<HTMLSelectElement>(null);
  const txtColorSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const quill = new Quill(".text-editor__text-area", {
      formats: [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "link",
        "blockquote",
        "background",
        "color",
      ],
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
        <div className="text-editor__toolbar-btns-container">
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
          <button
            className="ql-list check-list button"
            value="check"
            title="Check list"
          />
          <button className="ql-link button" title="Embedded link" />
          <button className="ql-blockquote button" title="Quote" />
          <div className="color-picker-container">
            <button
              className="ql-background button"
              title="Highlight"
              onClick={() => setShowBgColorPicker(true)}
            />
            <select
              className="ql-background color-select"
              defaultValue=""
              ref={bgColorSelectRef}
              onClick={() => setShowBgColorPicker(true)}
            >
              <option value="" />
              {COLORS.map((color) => (
                <option key={color.name} value={color.hex} />
              ))}
            </select>
            {showBgColorPicker && (
              <ColorPicker
                changeHandler={(value) => {
                  if (!bgColorSelectRef.current) return;
                  bgColorSelectRef.current.value = value;
                  bgColorSelectRef.current.dispatchEvent(new Event("change"));
                  setShowBgColorPicker(false);
                }}
                hideSelf={() => setShowBgColorPicker(false)}
              />
            )}
          </div>
          <div className="color-picker-container">
            <button
              className="ql-color button"
              title="Text color"
              onClick={() => setShowTxtColorPicker(true)}
            />
            <select
              className="ql-color color-select"
              defaultValue=""
              ref={txtColorSelectRef}
              onClick={() => setShowTxtColorPicker(true)}
            >
              <option value="" />
              {COLORS.map((color) => (
                <option key={color.name} value={color.hex} />
              ))}
            </select>
            {showTxtColorPicker && (
              <ColorPicker
                changeHandler={(value) => {
                  if (!txtColorSelectRef.current) return;
                  txtColorSelectRef.current.value = value;
                  txtColorSelectRef.current.dispatchEvent(new Event("change"));
                  setShowTxtColorPicker(false);
                }}
                hideSelf={() => setShowTxtColorPicker(false)}
              />
            )}
          </div>
        </div>
        <div className="text-editor__toolbar-btns-container">
          <button
            className={`text-editor--${
              isFullSized ? "shrink" : "maximize"
            } button`}
            title={`${isFullSized ? "Shrink editor" : "Maximize editor"}`}
            onClick={handleFullSize}
          />
        </div>
      </div>
      <div className="text-editor__text-area" />
    </div>
  );
}

export default TextEditor;
