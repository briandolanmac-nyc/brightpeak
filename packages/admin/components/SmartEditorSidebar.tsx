"use client";

import { FONT_OPTIONS } from "../config";
import { formatLabel } from "../utils";
import { CombinedSectionManager } from "./SectionManager";

export function SmartEditorSidebar({
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
        className="sb-input"
        placeholder="(empty)"
      />
    );
  }

  if (typeof data === "boolean") {
    return (
      <label className="sb-toggle">
        <input
          type="checkbox"
          checked={data}
          onChange={(e) => onChange(path, e.target.checked)}
        />
        <span className="sb-toggle-text">{data ? "Enabled" : "Disabled"}</span>
      </label>
    );
  }

  if (typeof data === "number") {
    if (path === "borderRadius" || path.endsWith(".borderRadius")) {
      const val = Math.max(1, Math.min(5, data));
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={val}
            onChange={(e) => onChange(path, Number(e.target.value))}
            style={{ flex: 1, accentColor: "#009968" }}
          />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, minWidth: "1.5rem", textAlign: "center" }}>{val}</span>
          <span style={{ fontSize: "0.7rem", color: "#888" }}>{val === 1 ? "None" : val === 2 ? "Subtle" : val === 3 ? "Medium" : val === 4 ? "Rounded" : "Max"}</span>
        </div>
      );
    }
    if (path === "style" || path.endsWith(".style")) {
      return (
        <div style={{ display: "flex", gap: "1rem" }}>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`style-${path}`} checked={data === 1} onChange={() => onChange(path, 1)} />
            Icons
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`style-${path}`} checked={data === 2} onChange={() => onChange(path, 2)} />
            Images
          </label>
        </div>
      );
    }
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
        className="sb-input"
      />
    );
  }

  if (typeof data === "string") {
    if (path === "heroAlignment" || path.endsWith(".heroAlignment")) {
      return (
        <div style={{ display: "flex", gap: "1rem" }}>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`heroAlignment-${path}`} checked={(data || "left") === "left"} onChange={() => onChange(path, "left")} />
            Left Aligned
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`heroAlignment-${path}`} checked={data === "center"} onChange={() => onChange(path, "center")} />
            Centered
          </label>
        </div>
      );
    }
    if (path === "footerStyle" || path.endsWith(".footerStyle")) {
      return (
        <div style={{ display: "flex", gap: "1rem" }}>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`footerStyle-${path}`} checked={(data || "dark") === "dark"} onChange={() => onChange(path, "dark")} />
            Dark
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`footerStyle-${path}`} checked={data === "light"} onChange={() => onChange(path, "light")} />
            Light
          </label>
        </div>
      );
    }
    if (path === "heroLayout" || path.endsWith(".heroLayout")) {
      return (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`heroLayout-${path}`} checked={(data || "fullscreen") === "fullscreen"} onChange={() => onChange(path, "fullscreen")} />
            Fullscreen
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`heroLayout-${path}`} checked={data === "split"} onChange={() => onChange(path, "split")} />
            Split
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`heroLayout-${path}`} checked={data === "diagonal"} onChange={() => onChange(path, "diagonal")} />
            Diagonal
          </label>
        </div>
      );
    }
    if (path === "mobileLayout" || path.endsWith(".mobileLayout")) {
      return (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`mobileLayout-${path}`} checked={(data || "fullscreen") === "fullscreen"} onChange={() => onChange(path, "fullscreen")} />
            Full Screen
          </label>
          <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
            <input type="radio" name={`mobileLayout-${path}`} checked={data === "noimage"} onChange={() => onChange(path, "noimage")} />
            No Image
          </label>
        </div>
      );
    }
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
    if ((path === "font" || path.endsWith(".font")) && FONT_OPTIONS.includes(data)) {
      return (
        <select
          value={data}
          onChange={(e) => onChange(path, e.target.value)}
          className="sb-input"
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
            style={{ width: "40px", height: "32px", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", padding: "2px", background: "#1a1a2e" }}
          />
          <input
            type="text"
            value={data}
            onChange={(e) => onChange(path, e.target.value)}
            className="sb-input"
            style={{ flex: 1 }}
            placeholder="#000000"
          />
        </div>
      );
    }
    if (data.length > 60) {
      return (
        <textarea
          value={data}
          onChange={(e) => onChange(path, e.target.value)}
          className="sb-textarea"
          rows={Math.min(6, Math.ceil(data.length / 40))}
        />
      );
    }
    return (
      <input
        type="text"
        value={data}
        onChange={(e) => onChange(path, e.target.value)}
        className="sb-input"
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
      <div className="sb-array">
        {data.map((item, index) => (
          <div key={index} className={`sb-array-item${useCards ? " sb-array-item-card" : ""}`}>
            <div className={`sb-array-head${useCards ? " sb-array-head-card" : ""}`}>
              <span className={useCards ? "sb-array-card-title" : "sb-array-idx"}>
                {useCards && <span className="sb-array-card-num">{index + 1}</span>}
                {useCards ? getItemLabel(item, index) : `#${index + 1}`}
              </span>
              <div style={{ display: "flex", gap: "0.25rem", marginLeft: "auto" }}>
                <button
                  onClick={() => {
                    if (index === 0) return;
                    const newArr = [...data];
                    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
                    onChange(path, newArr);
                  }}
                  disabled={index === 0}
                  className="sb-btn-reorder"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    if (index === data.length - 1) return;
                    const newArr = [...data];
                    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
                    onChange(path, newArr);
                  }}
                  disabled={index === data.length - 1}
                  className="sb-btn-reorder"
                  title="Move down"
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    const newArr = [...data];
                    newArr.splice(index, 1);
                    onChange(path, newArr);
                  }}
                  className="sb-btn-remove"
                >
                  x
                </button>
              </div>
            </div>
            <SmartEditorSidebar
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
          className="sb-btn-add"
        >
          + Add
        </button>
      </div>
    );
  }

  if (typeof data === "object" && !Array.isArray(data) && data !== null && /^links\.\d+$/.test(path)) {
    const item = data as Record<string, unknown>;
    const itemType = (item.type === "dropdown") ? "dropdown" : "regular";
    const children = Array.isArray(item.children) ? item.children as Record<string, unknown>[] : [];

    return (
      <div className="sb-object">
        <div className="sb-field">
          <label className="sb-label">Menu Label</label>
          <input
            type="text"
            value={(item.label as string) || ""}
            onChange={(e) => onChange(`${path}.label`, e.target.value)}
            className="sb-input"
          />
        </div>
        <div className="sb-field">
          <label className="sb-label">Type</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
              <input type="radio" name={`navtype-${path}`} checked={itemType === "dropdown"} onChange={() => {
                const updated = { ...item, type: "dropdown", children: Array.isArray(item.children) ? item.children : [{ label: "", href: "" }] };
                onChange(path, updated);
              }} />
              Dropdown
            </label>
            <label className="sb-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 400, margin: 0 }}>
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
          <div className="sb-field">
            <label className="sb-label">Link URL</label>
            <input
              type="text"
              value={(item.href as string) || ""}
              onChange={(e) => onChange(`${path}.href`, e.target.value)}
              className="sb-input"
              placeholder="/page-url"
            />
          </div>
        )}

        {itemType === "dropdown" && (
          <div className="sb-field">
            <label className="sb-label" style={{ fontWeight: 500, fontSize: "0.75rem" }}>Sub-links</label>
            <div style={{ paddingLeft: "0.75rem", borderLeft: "2px solid #333" }}>
              {children.map((child, ci) => (
                <div key={ci} style={{ marginBottom: "0.5rem", padding: "0.35rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#888" }}>Sub-link #{ci + 1}</span>
                    <button
                      onClick={() => {
                        const newChildren = [...children];
                        newChildren.splice(ci, 1);
                        onChange(`${path}.children`, newChildren);
                      }}
                      className="sb-btn-remove"
                    >
                      x
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <input
                      type="text"
                      value={(child.label as string) || ""}
                      onChange={(e) => onChange(`${path}.children.${ci}.label`, e.target.value)}
                      className="sb-input"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={(child.href as string) || ""}
                      onChange={(e) => onChange(`${path}.children.${ci}.href`, e.target.value)}
                      className="sb-input"
                      placeholder="/page-url"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => onChange(`${path}.children`, [...children, { label: "", href: "" }])}
                className="sb-btn-add"
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
        <div className="sb-field">
          <label className="sb-label">Sections</label>
          <p style={{ fontSize: "11px", color: "#888", margin: "0 0 8px 0" }}>Toggle sections on/off and drag to reorder</p>
          <CombinedSectionManager
            sections={obj.sections as Record<string, boolean>}
            order={obj.order as string[]}
            onChange={onChange}
            variant="sidebar"
          />
        </div>
      );
    }
    const entries = Object.entries(obj);
    const hasImagesArray = Array.isArray(obj.images);
    return (
      <div className="sb-object">
        {entries.map(([key, value]) => {
          if (key === "image" && hasImagesArray) return null;
          const fieldPath = path ? `${path}.${key}` : key;
          const isGroup = value !== null && typeof value === "object";
          const isImageField = key === "images" || key === "image";
          const useHeading = isGroup && !isImageField && !insideArrayItem;
          return (
            <div key={key} className="sb-field">
              <label className={useHeading ? "sb-label sb-label-heading" : "sb-label"}>
                {formatLabel(key)}
              </label>
              <SmartEditorSidebar data={value} onChange={onChange} path={fieldPath} insideArrayItem={insideArrayItem} />
            </div>
          );
        })}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}
