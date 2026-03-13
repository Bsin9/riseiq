"use client";
import { useState } from "react";

/**
 * Client component — handles the interactive module tab switching
 * on the course detail page.
 */
export function ModuleTabs({ modules }) {
  const [activeKey, setActiveKey] = useState(modules[0]?.key ?? "");

  const activeModule = modules.find((m) => m.key === activeKey) ?? modules[0];

  return (
    <div>
      {/* ── Tab buttons ─────────────────────────────────────────── */}
      <div className="lhub-module-tabs" id="modules">
        {modules.map((mod) => (
          <button
            key={mod.key}
            className={`lhub-mod-tab${activeKey === mod.key ? " active" : ""}`}
            style={{ "--mod-color": mod.color }}
            onClick={() => setActiveKey(mod.key)}
            aria-selected={activeKey === mod.key}
            role="tab"
          >
            <span className="lhub-mod-tab-icon">{mod.icon}</span>
            <span>{mod.title}</span>
          </button>
        ))}
      </div>

      {/* ── Active module panel ──────────────────────────────────── */}
      {activeModule && (
        <div className="lhub-module-panel active">

          {/* Panel header */}
          <div className="lhub-panel-head" style={{ borderLeft: `3px solid ${activeModule.color}` }}>
            <div className="lhub-panel-head-left">
              <span
                className="lhub-panel-icon"
                style={{ background: `${activeModule.color}22`, color: activeModule.color }}
              >
                {activeModule.icon}
              </span>
              <div>
                <div className="lhub-panel-title">{activeModule.title}</div>
                <div className="lhub-panel-count">{activeModule.lessons.length} lessons</div>
              </div>
            </div>
            <div className="lhub-panel-progress-wrap">
              <div className="lhub-panel-progress-bar">
                <div
                  className="lhub-panel-progress-fill"
                  style={{ background: activeModule.color, width: "0%" }}
                />
              </div>
              <span className="lhub-panel-progress-label">0% complete</span>
            </div>
          </div>

          {/* Lesson list */}
          <div className="lhub-lesson-list">
            {activeModule.lessons.map((lesson, idx) => (
              <div key={idx} className="lhub-lesson-row">
                <div className="lhub-lesson-num-wrap">
                  <span
                    className="lhub-lesson-num"
                    style={{
                      background: `${activeModule.color}18`,
                      color: activeModule.color,
                    }}
                  >
                    {idx + 1}
                  </span>
                </div>

                <div className="lhub-lesson-icon-wrap">
                  {lesson.type === "test" ? (
                    <span className="lhub-lesson-type-icon lhub-type-test" aria-label="Practice test">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </span>
                  ) : (
                    <span className="lhub-lesson-type-icon lhub-type-lesson" aria-label="Lesson">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </span>
                  )}
                </div>

                <div className="lhub-lesson-info">
                  <span className="lhub-lesson-title">{lesson.title}</span>
                  <span className="lhub-lesson-type-label">
                    {lesson.type === "test" ? "Practice Test" : "Lesson"}
                  </span>
                </div>

                <div className="lhub-lesson-right">
                  <span className="lhub-lesson-duration">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {lesson.duration}
                  </span>
                  <button
                    className="lhub-lesson-btn"
                    style={{ "--btn-color": activeModule.color }}
                  >
                    {lesson.type === "test" ? "Take Test" : "Start"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
