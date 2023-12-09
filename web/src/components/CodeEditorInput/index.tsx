import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function CodeEditorInput({ code, setCode }) {
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode && setCode(evn.target.value)}
      padding={15}
      style={{
        backgroundColor: "#f5f5f5",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
}
