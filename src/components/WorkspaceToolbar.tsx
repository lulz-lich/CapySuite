import { CopyPlus, FileInput, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

interface WorkspaceToolbarProps {
  canDelete: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onImport: (content: string) => void;
}

export function WorkspaceToolbar({
  canDelete,
  onDuplicate,
  onDelete,
  onImport
}: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      onImport(await file.text());
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed.");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="workspace-toolbar">
      <input
        ref={inputRef}
        className="hidden-file-input"
        type="file"
        accept="application/json,.json"
        onChange={(event) => void handleImport(event.target.files?.[0])}
      />
      <div className="workspace-actions">
        <button
          className="icon-text-button"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <FileInput size={15} />
          Import JSON
        </button>
        <button className="icon-text-button" type="button" onClick={onDuplicate}>
          <CopyPlus size={15} />
          Duplicate
        </button>
        <button
          className="icon-text-button danger"
          type="button"
          disabled={!canDelete}
          onClick={onDelete}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
      {error ? <span className="inline-error">{error}</span> : null}
    </div>
  );
}
