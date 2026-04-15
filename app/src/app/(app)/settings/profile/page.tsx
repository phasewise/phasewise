"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Check, User } from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  fullName: string;
  email: string;
  title: string | null;
  phone: string | null;
  photoUrl: string | null;
  role: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setFullName(data.fullName);
        setTitle(data.title ?? "");
        setPhone(data.phone ?? "");
        setPhotoUrl(data.photoUrl ?? "");
      });
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError("");

    let uploadBlob: Blob = file;
    try {
      uploadBlob = await compressImage(file, 800, 0.85);
    } catch {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be under 2MB");
        setUploading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", uploadBlob, "avatar.jpg");

    try {
      const res = await fetch("/api/user/photo", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Upload failed");
      }
      const { url } = await res.json();
      setPhotoUrl(url);
      // Auto-save the photo URL
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, title, phone }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[#E2EBE4] rounded" />
          <div className="h-32 bg-[#E2EBE4] rounded-xl" />
        </div>
      </div>
    );
  }

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Settings
      </Link>

      <h1 className="font-serif text-2xl text-[#1A2E22] mb-1">Your Profile</h1>
      <p className="text-[#6B8C74] text-sm mb-8">
        Update your personal information and profile photo.
      </p>

      {/* Photo */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#E2EBE4]"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xl font-semibold">
              {initials || <User size={28} />}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
          >
            {uploading ? (
              <span className="text-xs">...</span>
            ) : (
              <Camera size={20} />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <div>
          <div className="text-sm font-medium text-[#1A2E22]">{fullName}</div>
          <div className="text-xs text-[#6B8C74]">{profile.email}</div>
          <div className="text-xs text-[#A3BEA9] mt-0.5 capitalize">{profile.role.toLowerCase()}</div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-[#E2EBE4] rounded-xl p-6 space-y-5">
        <div>
          <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full bg-[#F0F2F0] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#6B8C74] text-sm cursor-not-allowed"
          />
          <p className="text-xs text-[#A3BEA9] mt-1">Email is tied to your login and cannot be changed here.</p>
        </div>

        <div>
          <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Landscape Architect"
            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-[#1A2E22] text-sm focus:outline-none focus:border-[#52B788] focus:bg-white transition-colors"
          />
        </div>

        {error && <p className="text-[#B04030] text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !fullName.trim()}
            className="bg-[#2D6A4F] hover:bg-[#40916C] text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-[#40916C] text-sm flex items-center gap-1">
              <Check size={14} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function compressImage(file: File, maxDim: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
          "image/jpeg",
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
