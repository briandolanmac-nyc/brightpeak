"use client";

import { useState, useEffect, useCallback } from "react";
import { SECTION_LABELS, SECTION_ORDER, SECTION_GROUPS } from "../config";
import { setNestedValue } from "../utils";
import type { FileData } from "../utils";
import { SmartEditorSidebar } from "./SmartEditorSidebar";

export default function AdminSidebar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFile, setActiveFile] = useState("HeroSection.json");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [modified, setModified] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: "success" | "error"; message: string; url?: string } | null>(null);

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
    setMounted(true);
    const stored = sessionStorage.getItem("admin_password");
    if (stored) setPasswordInput(stored);
    const wasOpen = sessionStorage.getItem("admin_sidebar_open");
    const storedFile = sessionStorage.getItem("admin_sidebar_file");
    if (wasOpen === "true") {
      setOpen(true);
      if (storedFile) setActiveFile(storedFile);
    }
  }, []);

  useEffect(() => {
    if (open) {
      sessionStorage.setItem("admin_sidebar_open", "true");
    } else {
      sessionStorage.removeItem("admin_sidebar_open");
    }
  }, [open]);

  useEffect(() => {
    sessionStorage.setItem("admin_sidebar_file", activeFile);
  }, [activeFile]);

  useEffect(() => {
    if (!open) return;
    if (files.length === 0) {
      loadData();
    }
  }, [open, files.length, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_password", passwordInput);
    await loadData();
  };

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
    if (!fileData) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ file: fileName, data: fileData.data }),
      });

      if (res.ok) {
        setSaveStatus("Saved!");
        setModified((prev) => {
          const next = new Set(prev);
          next.delete(fileName);
          return next;
        });
      } else {
        setSaveStatus("Error saving");
      }
    } catch {
      setSaveStatus("Error saving");
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (modified.size > 0) {
      setPublishStatus({ type: "error", message: "Save all changes first" });
      return;
    }
    setPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST", headers: getHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.filesCount === 0) {
          setPublishStatus({ type: "success", message: "No changes to submit — everything is up to date" });
        } else {
          setPublishStatus({ type: "success", message: `Submitted ${data.filesCount} changed file(s) for review`, url: data.url });
        }
      } else {
        setPublishStatus({ type: "error", message: data.error || "Submit failed" });
      }
    } catch {
      setPublishStatus({ type: "error", message: "Submit failed" });
    }
    setPublishing(false);
  };

  const activeData = files.find((f) => f.file === activeFile);

  if (!mounted) return null;

  return (
    <>
      <button
        className="sb-toggle-btn"
        onClick={() => {
          setOpen(!open);
          if (!open && !authenticated) {
            const stored = sessionStorage.getItem("admin_password");
            if (stored) {
              setPasswordInput(stored);
            }
          }
        }}
        title={open ? "Close editor" : "Open editor"}
      >
        {open ? "✕" : "✎"}
      </button>

      {open && (
        <div className="sb-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`sb-panel ${open ? "sb-panel-open" : ""}`}>
        {!authenticated ? (
          <div className="sb-auth">
            <h3 className="sb-auth-title">Admin Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="sb-input"
                autoFocus
              />
              {authError && <p className="sb-error">{authError}</p>}
              <button type="submit" className="sb-btn-login">
                Sign In
              </button>
            </form>
          </div>
        ) : loading ? (
          <div className="sb-auth">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="sb-header">
              <div className="sb-dropdown-wrap">
                <button
                  type="button"
                  className="sb-select"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{SECTION_LABELS[activeFile]}{modified.has(activeFile) ? " *" : ""}</span>
                  <span className="sb-select-arrow">{dropdownOpen ? "▴" : "▾"}</span>
                </button>
                {dropdownOpen && (
                  <div className="sb-dropdown-menu">
                    {SECTION_GROUPS.map((group) => (
                      <div key={group.label} className="sb-dropdown-group">
                        <div className="sb-dropdown-group-label">{group.label}</div>
                        {group.files.map((f) => (
                          <button
                            key={f}
                            type="button"
                            className={`sb-dropdown-item${activeFile === f ? " active" : ""}${modified.has(f) ? " modified" : ""}`}
                            onClick={() => { setActiveFile(f); setDropdownOpen(false); }}
                          >
                            {SECTION_LABELS[f]}{modified.has(f) ? " *" : ""}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="sb-header-actions">
                <div className="sb-actions-left">
                  <button
                    onClick={() => {
                      setModified(new Set());
                      loadData();
                    }}
                    disabled={loading}
                    className="sb-btn-refresh"
                    title="Refresh data"
                  >
                    {loading ? "..." : "↻"}
                  </button>
                  <button
                    onClick={() => handleSave(activeFile)}
                    disabled={saving || !modified.has(activeFile)}
                    className="sb-btn-save"
                  >
                    {saving ? "..." : "Save"}
                  </button>
                  {saveStatus && (
                    <span className={`sb-status ${saveStatus.includes("Error") ? "sb-status-err" : "sb-status-ok"}`}>
                      {saveStatus}
                    </span>
                  )}
                </div>
                <button
                  onClick={handlePublish}
                  disabled={publishing || modified.size > 0}
                  className="sb-btn-submit"
                  title={modified.size > 0 ? "Save all changes first" : "Submit changes for review"}
                >
                  {publishing ? "..." : "Submit for Review"}
                </button>
              </div>
              {publishStatus && (
                <div className={`sb-publish-status ${publishStatus.type === "success" ? "sb-publish-ok" : "sb-publish-err"}`}>
                  <span>{publishStatus.message}</span>
                  {publishStatus.url && (
                    <a href={publishStatus.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                  )}
                </div>
              )}
            </div>

            <div className="sb-body">
              {activeData && (
                <SmartEditorSidebar
                  key={activeFile}
                  data={activeData.data}
                  onChange={(fieldPath, value) =>
                    handleFieldChange(activeFile, fieldPath, value)
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
