"use client";

import { useState, useEffect, useCallback } from "react";
import { SECTION_LABELS, SECTION_ORDER, SECTION_GROUPS } from "../config";
import { setNestedValue, formatLabel } from "../utils";
import type { FileData } from "../utils";
import { SmartEditorPage } from "./SmartEditorPage";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFile, setActiveFile] = useState<string>("HomePage.json");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [modified, setModified] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (passwordInput) headers["x-admin-password"] = passwordInput;
    return headers;
  }, [passwordInput]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", { headers: getHeaders() });
      if (res.status === 401) {
        setAuthenticated(false);
        setAuthError("Invalid password");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setFiles(json.files);
      setAuthenticated(true);
      setAuthError("");
    } catch {
      setAuthError("Failed to load data");
    }
    setLoading(false);
  }, [getHeaders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFieldChange = useCallback((filePath: string, fieldPath: string, value: unknown) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.file !== filePath) return f;
        const newData = setNestedValue(f.data, fieldPath, value);
        return { ...f, data: newData as Record<string, unknown> };
      })
    );
    setModified((prev) => new Set([...prev, filePath]));
    setSaveStatus("");
  }, []);

  const handleSave = async (fileName: string) => {
    setSaving(true);
    setSaveStatus("");
    const fileData = files.find((f) => f.file === fileName);
    if (!fileData) return;

    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ file: fileName, data: fileData.data }),
      });

      if (res.ok) {
        setSaveStatus(`${SECTION_LABELS[fileName] || formatLabel(fileName)} saved successfully`);
        setModified((prev) => {
          const next = new Set(prev);
          next.delete(fileName);
          return next;
        });
      } else {
        setSaveStatus("Error saving changes");
      }
    } catch {
      setSaveStatus("Error saving changes");
    }
    setSaving(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const modifiedFiles = files.filter((f) => modified.has(f.file));
    let allOk = true;

    for (const fileData of modifiedFiles) {
      try {
        const res = await fetch("/api/admin/data", {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ file: fileData.file, data: fileData.data }),
        });
        if (!res.ok) allOk = false;
      } catch {
        allOk = false;
      }
    }

    if (allOk) {
      setSaveStatus(`All ${modifiedFiles.length} section(s) saved`);
      setModified(new Set());
    } else {
      setSaveStatus("Some sections failed to save");
    }
    setSaving(false);
  };

  const activeData = files.find((f) => f.file === activeFile);

  const filteredGroups = SECTION_GROUPS.map((group) => ({
    ...group,
    files: group.files.filter((f) =>
      SECTION_LABELS[f]?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((group) => group.files.length > 0);

  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <a href="/" className="admin-back-link">View Site</a>
        </div>
        <div className="admin-sidebar-search">
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <nav className="admin-nav">
          {filteredGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.label}</div>
              {group.files.map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`admin-nav-item ${activeFile === file ? "active" : ""} ${modified.has(file) ? "modified" : ""}`}
                >
                  <span>{SECTION_LABELS[file]}</span>
                  {modified.has(file) && <span className="admin-modified-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {modified.size > 0 && (
          <div className="admin-sidebar-footer">
            <button onClick={handleSaveAll} disabled={saving} className="admin-btn-save-all">
              {saving ? "Saving..." : `Save All (${modified.size})`}
            </button>
          </div>
        )}
      </aside>

      <main className="admin-main">
        <div className="admin-toolbar">
          <div>
            <h1 className="admin-page-title">{SECTION_LABELS[activeFile]}</h1>
            <p className="admin-file-path">data/{activeFile.startsWith("pages/") ? activeFile : `home/${activeFile}`}</p>
          </div>
          <div className="admin-toolbar-actions">
            {saveStatus && (
              <span className={`admin-save-status ${saveStatus.includes("Error") ? "error" : "success"}`}>
                {saveStatus}
              </span>
            )}
            <button
              onClick={() => handleSave(activeFile)}
              disabled={saving || !modified.has(activeFile)}
              className="admin-btn-save"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="admin-content">
          {activeData && (
            <SmartEditorPage
              key={activeFile}
              data={activeData.data}
              onChange={(fieldPath, value) => handleFieldChange(activeFile, fieldPath, value)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
