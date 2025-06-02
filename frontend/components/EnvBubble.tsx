"use client";
import React, { useRef, useState } from "react";
import { FaBug } from "react-icons/fa";

const mode = process.env.NODE_ENV;
const mainDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
const allowed = process.env.NEXT_PUBLIC_TENANT_SUBDOMAINS;
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const authMode = process.env.NEXT_PUBLIC_AUTH_MODE;

const color =
  mode === "production"
    ? "bg-green-600"
    : mode === "development"
    ? "bg-yellow-600"
    : "bg-gray-500";

export default function EnvBubble() {
  // 🟢 Get authMode from context

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const movedDuringDrag = useRef(false);

  React.useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
  }, [pos.x, pos.y]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    movedDuringDrag.current = false;
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current || !bubbleRef.current) return;
    let nx = e.clientX - offset.current.x;
    let ny = e.clientY - offset.current.y;
    const el = bubbleRef.current;
    const maxX = window.innerWidth - el.offsetWidth - 8;
    const maxY = window.innerHeight - el.offsetHeight - 8;
    nx = Math.max(8, Math.min(maxX, nx));
    ny = Math.max(8, Math.min(maxY, ny));
    el.style.transform = `translate(${nx}px, ${ny}px)`;
    movedDuringDrag.current = true;
  };

  const onMouseUp = () => {
    if (dragging.current && bubbleRef.current) {
      const el = bubbleRef.current;
      const transform = el.style.transform;
      const match = /translate\(([\d.]+)px, ([\d.]+)px\)/.exec(transform);
      if (match) {
        setPos({ x: Number(match[1]), y: Number(match[2]) });
      }
    }
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onClick = () => {
    if (!movedDuringDrag.current) setOpen((v) => !v);
    movedDuringDrag.current = false;
  };

  const glass = "backdrop-blur-md bg-white/70 shadow-xl";
  const closedBg = color + " shadow-lg";
  const border = open ? "border border-white/30" : "";

  return (
    <div
      ref={bubbleRef}
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        minWidth: open ? 300 : 48,
        minHeight: 48,
        borderRadius: 9999,
        userSelect: "none",
        cursor: dragging.current ? "grabbing" : "grab",
        transition: "box-shadow .15s, background .25s, border .2s",
      }}
      className={`${open ? glass : closedBg} ${border}`}
      onMouseDown={onMouseDown}
      onClick={onClick}
      tabIndex={-1}
    >
      <div
        className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs select-none`}
        style={{
          color: open ? "#233" : "#fff",
          justifyContent: open ? "flex-start" : "center",
        }}
      >
        <FaBug size={20} className={open ? "text-gray-800/70 mr-1" : "mr-1"} />
        {!open ? (
          <span className="font-semibold tracking-wide text-base">
            {mode === "production" ? "PROD" : "DEV"}
          </span>
        ) : (
          <div className="text-left ml-2" style={{ minWidth: 180 }}>
            <div className="font-bold mb-2 text-lg">
              {mode === "production" ? (
                <span className="text-green-700">Production</span>
              ) : (
                <span className="text-yellow-700">Development</span>
              )}
            </div>
            {/* 🟢 Auth Mode Section */}
            <div className="mb-2 text-[13px]">
              <span className="font-semibold">Auth Mode:</span>
              <br />
              <span
                className={`inline-block rounded px-2 my-0.5 ${
                  authMode === "token"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {authMode === "token"
                  ? "Token (Bearer)"
                  : "Cookie (Sanctum)"}
              </span>
            </div>
            <div className="mb-2 text-[13px]">
              <span className="font-semibold">Main Domain:</span>
              <br />
              <span className="text-gray-700">{mainDomain}</span>
            </div>
            <div className="mb-2 text-[13px]">
              <span className="font-semibold">Allowed Tenants:</span>
              <br />
              <span className="text-gray-700">
                {allowed?.split(",").map((a, i) => (
                  <span
                    key={i}
                    className="inline-block bg-blue-50 text-blue-900 rounded px-2 mr-1 my-0.5"
                  >
                    {a}
                  </span>
                ))}
              </span>
            </div>
            <div className="mb-1 text-[13px]">
              <span className="font-semibold">API URL:</span>
              <br />
              <span className="text-gray-700">{apiUrl}</span>
            </div>
            <div className="mt-2 text-[11px] text-gray-600">
              Drag me anywhere. <br />
              Click to hide.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
