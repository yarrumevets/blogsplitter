"use client";

import { useState } from "react";

export default function ImageUploader({
  uploadImage,
}: {
  uploadImage: (formData: FormData) => Promise<string>;
}) {
  const [urls, setUrls] = useState<string[]>([]);

  async function handleUpload(formData: FormData) {
    const url = await uploadImage(formData);
    setUrls((current) => [...current, url]);
  }

  return (
    <>
      <form action={handleUpload}>
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload image</button>
      </form>

      <ul>
        {urls.map((url) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
