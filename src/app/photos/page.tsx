import { AlertTriangle } from "lucide-react";
import { getUserData } from "@/lib/store";
import { Card, Eyebrow } from "@/components/ui";
import { PhotoUpload } from "@/components/photo-upload";
import { PhotoGallery } from "@/components/photo-gallery";

export default async function PhotosPage() {
  const data = await getUserData();
  const passphraseSet = Boolean(process.env.APP_PASSPHRASE);
  const blobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div className="flex flex-col gap-6">
      <div><Eyebrow>Progress Photos</Eyebrow><h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">Body Progress</h1></div>
      {!passphraseSet && (
        <div className="flex gap-3 rounded-xl border border-[var(--color-ember)]/40 bg-[var(--color-ember-dim)] p-4 text-sm text-[#ffd7c2]">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>No passphrase is set on this app yet. These photos are stored privately, but anyone with your app URL can currently open this page. Set <code>APP_PASSPHRASE</code> in your Vercel project settings before you rely on this.</p>
        </div>
      )}
      {!blobConnected && (
        <div className="flex gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-sm text-[var(--color-muted)]">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>Photo storage isn&apos;t connected yet. Add a Vercel Blob store to this project (Storage tab, private access) and redeploy, see the README.</p>
        </div>
      )}
      <Card><Eyebrow>Add a photo</Eyebrow><PhotoUpload /></Card>
      <Card><Eyebrow>Gallery</Eyebrow><PhotoGallery photos={data.photos} /></Card>
    </div>
  );
}
