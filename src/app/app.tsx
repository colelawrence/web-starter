// Bootstrapping for entire application
import * as React from 'react'
import MonacoEditor from 'react-monaco-editor';
import { createEditor } from './editor';

const EditorCtx = React.createContext(createEditor())

export function App() {
  const editor = React.useContext(EditorCtx)

  return (
    <MonacoEditor editorWillMount={editor.setMonaco} options={editor.options} defaultValue={editor.defaultValue}/>
  )
}
