"use client";

import { FONT_OPTIONS } from "../config";
import { formatLabel } from "../utils";
import { CombinedSectionManager } from "./SectionManager";

export function SmartEditorPage({
  data,
  onChange,
  path = "",
  insideArrayItem = false,
}: {
  data: unknown;
  onChange: (path: string, value: unknown) => void;
  path?: string;
  insideArrayItem?: boolean;
}) {
  if (data === null || data === undefined) {
    return (
      <input
        type="text"
        value=""
        onChange={(e) => onChange(path, e.target.value || null)}
        className="admin-input"
        placeholder="(empty)"
      />
    );
  }

  if (typeof data === "boolean") {
    return (
      <label className="admin-toggle">
        <input
          type="checkbox"
          checked={data}
          onChange={(e) => onChange(path, e.target.checked)}
        />
        <span className="admin-toggle-label">{data ? "Enabled" : "Disabled"}</span>
      </label>
    );
  }

  if (typeof data === "number") {
    return (
      <input
        type="text"
        inputMode="numeric"
        value={String(data)}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || v === "-") { onChange(path, 0); return; }
          const n = Number(v);
          if (!isNaN(n)) onChange(path, n);
        }}
        className="admin-input"
      />
    );
  }

  if (typeof data === "string") {
    if (path === "logoPosition" || path.endsWith(".logoPosition")) {
      const pos = (data || "navbar").toLowerCase();
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="radio" name={`logoPosition-${path}`} checked={pos === "header"} onChange={() => onChange(path, "header")} />
            <span>Logo in Header</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="radio" name={`logoPosition-${path}`} checked={pos === "navbar"} onChange={() => onChange(path, "navbar")} />
            <span>Logo in Navigation Bar</span>
          </label>
        </div>
      );
    }
    if (path === "heroAlignment" || path.endsWith(".heroAlignment")) {
      return (
        <div style={{ display: "flex", gap: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`heroAlignment-${path}`} checked={(data || "left") === "left"} onChange={() => onChange(path, "left")} />
            Left Aligned
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`heroAlignment-${path}`} checked={data === "center"} onChange={() => onChange(path, "center")} />
            Centered
          </label>
        </div>
      );
    }
    if (path === "heroLayout" || path.endsWith(".heroLayout")) {
      return (
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`heroLayout-${path}`} checked={(data || "fullscreen") === "fullscreen"} onChange={() => onChange(path, "fullscreen")} />
            Fullscreen
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`heroLayout-${path}`} checked={data === "split"} onChange={() => onChange(path, "split")} />
            Split
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`heroLayout-${path}`} checked={data === "diagonal"} onChange={() => onChange(path, "diagonal")} />
            Diagonal
          </label>
        </div>
      );
    }
    if (path === "mobileLayout" || path.endsWith(".mobileLayout")) {
      return (
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`mobileLayout-${path}`} checked={(data || "fullscreen") === "fullscreen"} onChange={() => onChange(path, "fullscreen")} />
            Full Screen
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
            <input type="radio" name={`mobileLayout-${path}`} checked={data === "noimage"} onChange={() => onChange(path, "noimage")} />
            No Image
          </label>
        </div>
      );
    }
    if ((path === "font" || path.endsWith(".font")) && FONT_OPTIONS.includes(data)) {
      return (
        <select
          value={data}
          onChange={(e) => onChange(path, e.target.value)}
          className="admin-input"
          style={{ fontFamily: `"${data}", sans-serif` }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>
              {f}
            </option>
          ))}
        </select>
      );
    }
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(data)) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input
            type="color"
            value={data.length === 4 ? `#${data[1]}${data[1]}${data[2]}${data[2]}${data[3]}${data[3]}` : data.slice(0, 7)}
            onChange={(e) => onChange(path, e.target.value)}
            style={{ width: "48px", height: "36px", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", padding: "2px", background: "#1a1a2e" }}
          />
          <input
            type="text"
            value={data}
            onChange={(e) => onChange(path, e.target.value)}
            className="admin-input"
            style={{ flex: 1 }}
            placeholder="#000000"
          />
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: data, border: "2px solid #444", flexShrink: 0 }} />
        </div>
      );
    }
    if (data.length > 80) {
      return (
        <textarea
          value={data}
          onChange={(e) => onChange(path, e.target.value)}
          className="admin-textarea"
          rows={Math.min(8, Math.ceil(data.length / 60))}
        />
      );
    }
    return (
      <input
        type="text"
        value={data}
        onChange={(e) => onChange(path, e.target.value)}
        className="admin-input"
      />
    );
  }

  if (Array.isArray(data)) {
    const isObjectArray = data.length > 0 && typeof data[0] === "object" && data[0] !== null && !Array.isArray(data[0]);
    const useCards = isObjectArray && !insideArrayItem;

    const getItemLabel = (item: unknown, index: number): string => {
      if (!isObjectArray) return `#${index + 1}`;
      const obj = item as Record<string, unknown>;
      const name = obj.title || obj.label || obj.name || obj.author || obj.question || "";
      if (name && typeof name === "string") return `${name}`;
      return `Item ${index + 1}`;
    };

    return (
      <div className="admin-array">
        {data.map((item, index) => (
          <div key={index} className={`admin-array-item${useCards ? " admin-array-item-card" : ""}`}>
            <div className={`admin-array-header${useCards ? " admin-array-header-card" : ""}`}>
              <span className={useCards ? "admin-array-card-title" : "admin-array-index"}>
                {useCards && <span className="admin-array-card-num">{index + 1}</span>}
                {useCards ? getItemLabel(item, index) : `#${index + 1}`}
              </span>
              <button
                onClick={() => {
                  const newArr = [...data];
                  newArr.splice(index, 1);
                  onChange(path, newArr);
                }}
                className="admin-btn-delete"
                title="Remove item"
              >
                Remove
              </button>
            </div>
            <SmartEditorPage
              data={item}
              onChange={onChange}
              path={path ? `${path}.${index}` : `${index}`}
              insideArrayItem={useCards}
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newItem =
              data.length > 0
                ? typeof data[0] === "object"
                  ? JSON.parse(JSON.stringify(data[0]))
                  : ""
                : "";
            onChange(path, [...data, newItem]);
          }}
          className="admin-btn-add"
        >
          + Add Item
        </button>
      </div>
    );
  }

  if (path === "contactForm") {
    const val = typeof data === "string" ? data : "/contact";
    return (
      <div className="admin-object">
        <div className="admin-field">
          <label className="admin-label">Contact Form</label>
          <input
            type="text"
            value={val}
            onChange={(e) => onChange(path, e.target.value)}
            className="admin-input"
            placeholder="/contact or https://example.com/form"
          />
        </div>
      </div>
    );
  }

  if (typeof data === "object" && !Array.isArray(data) && data !== null && /^links\.\d+$/.test(path)) {
    const item = data as Record<string, unknown>;
    const itemType = (item.type === "dropdown") ? "dropdown" : "regular";
    const children = Array.isArray(item.children) ? item.children as Record<string, unknown>[] : [];

    return (
      <div className="admin-object">
        <div className="admin-field">
          <label className="admin-label">Menu Label</label>
          <input
            type="text"
            value={(item.label as string) || ""}
            onChange={(e) => onChange(`${path}.label`, e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Type</label>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="radio" name={`navtype-${path}`} checked={itemType === "dropdown"} onChange={() => {
                const updated = { ...item, type: "dropdown", children: Array.isArray(item.children) ? item.children : [{ label: "", href: "" }] };
                onChange(path, updated);
              }} />
              Dropdown
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="radio" name={`navtype-${path}`} checked={itemType === "regular"} onChange={() => {
                const { type: _t, children: _c, mobileLabel: _m, ...rest } = item as any;
                const updated = { ...rest, href: item.href || "/" };
                onChange(path, updated);
              }} />
              Regular
            </label>
          </div>
        </div>

        {itemType === "regular" && (
          <div className="admin-field">
            <label className="admin-label">Link URL</label>
            <input
              type="text"
              value={(item.href as string) || ""}
              onChange={(e) => onChange(`${path}.href`, e.target.value)}
              className="admin-input"
              placeholder="/page-url"
            />
          </div>
        )}

        {itemType === "dropdown" && (
          <div className="admin-field">
            <label className="admin-label" style={{ fontWeight: 500, fontSize: "0.8rem" }}>Sub-links</label>
            <div style={{ paddingLeft: "1rem", borderLeft: "2px solid #333" }}>
              {children.map((child, ci) => (
                <div key={ci} style={{ marginBottom: "0.75rem", padding: "0.5rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>Sub-link #{ci + 1}</span>
                    <button
                      onClick={() => {
                        const newChildren = [...children];
                        newChildren.splice(ci, 1);
                        onChange(`${path}.children`, newChildren);
                      }}
                      className="admin-btn-delete"
                      title="Remove sub-link"
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <input
                      type="text"
                      value={(child.label as string) || ""}
                      onChange={(e) => onChange(`${path}.children.${ci}.label`, e.target.value)}
                      className="admin-input"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={(child.href as string) || ""}
                      onChange={(e) => onChange(`${path}.children.${ci}.href`, e.target.value)}
                      className="admin-input"
                      placeholder="/page-url"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => onChange(`${path}.children`, [...children, { label: "", href: "" }])}
                className="admin-btn-add"
              >
                + Add Sub-link
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (!path && obj.sections && obj.order && typeof obj.sections === "object" && Array.isArray(obj.order)) {
      return (
        <div className="admin-field">
          <label className="admin-label">Sections</label>
          <p style={{ fontSize: "0.8rem", color: "#888", margin: "0 0 8px 0" }}>Toggle sections on/off and drag to reorder</p>
          <CombinedSectionManager
            sections={obj.sections as Record<string, boolean>}
            order={obj.order as string[]}
            onChange={onChange}
            variant="page"
          />
        </div>
      );
    }
    const entries = Object.entries(obj);
    const hasImagesArray = Array.isArray(obj.images);
    return (
      <div className="admin-object">
        {entries.map(([key, value]) => {
          if (key === "image" && hasImagesArray) return null;
          const fieldPath = path ? `${path}.${key}` : key;
          const isNested = typeof value === "object" && value !== null && !Array.isArray(value);
          const isArray = Array.isArray(value);
          const isImageField = key === "images" || key === "image";
          const suppressHeadline = insideArrayItem || isImageField;
          return (
            <div
              key={key}
              className={`admin-field ${(isNested || isArray) && !suppressHeadline ? "admin-field-nested" : ""}`}
            >
              <label className="admin-label">{formatLabel(key)}</label>
              <SmartEditorPage data={value} onChange={onChange} path={fieldPath} insideArrayItem={insideArrayItem} />
            </div>
          );
        })}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}
