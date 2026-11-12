import { MediaLibrary } from "@/components/admin/media-library";

export default function MediaPage() {
  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Media</h1>
          <p>Images and files for blog posts, authors and pages. Copy a file&apos;s URL to use it anywhere.</p>
        </div>
      </div>
      <MediaLibrary />
    </>
  );
}
