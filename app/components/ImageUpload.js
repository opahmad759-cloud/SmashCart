"use client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

// shows the current photo and lets the admin choose a new one from the computer
export default function ImageUpload({ value, onChange }) {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    async function handleFile(e) {
        const file = e.target.files?.[0];
        e.target.value = ""; // so the same file can be chosen again
        if (!file) return;

        setError("");
        setUploading(true);
        try {
            const body = new FormData();
            body.append("image", file);
            const res = await fetch(`${API}/api/admin/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed");
            onChange(data.url);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-line bg-bg2">
                {value ? (
                    <Image src={value} alt="Product photo" fill sizes="112px" className="object-contain p-1" />
                ) : (
                    <span className="flex h-full items-center justify-center text-xs text-muted">No photo</span>
                )}
            </div>
            <div>
                <label className="inline-block cursor-pointer rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-bold hover:border-brand">
                    {uploading ? "Uploading..." : value ? "Change photo" : "Choose photo"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} disabled={uploading} className="hidden" />
                </label>
                <p className="mt-1.5 text-xs text-muted">JPG, PNG or WebP, up to 4 MB.</p>
                {error && <p className="mt-1.5 text-sm font-semibold text-brand">{error}</p>}
            </div>
        </div>
    );
}