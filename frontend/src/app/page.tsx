import { revalidatePath } from "next/cache";
import ImageUploader from "./ImageUploader";

// type Post = {
//   id: number;
//   title: string;
//   body_html: string;
//   created_at: string;
//   tags: string[];
// };

async function createPost(formData: FormData) {
  "use server";

  const bodyHtml = String(formData.get("body_html") ?? "");

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: String(formData.get("title") ?? ""),
      body_html: bodyHtml,
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }),
  });

  revalidatePath("/");
}

async function uploadImage(formData: FormData) {
  "use server";

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
    method: "POST",
    body: formData,
  });

  const { url } = await response.json();
  return url;
}

export default async function Home() {
  return (
    <main>
      <form action={createPost}>
        <input name="title" placeholder="Title" required />
        <textarea name="body_html" placeholder="Post body" required />
        <input name="tags" placeholder="Tags, comma separated" />
        <button type="submit">Create post</button>
      </form>
      <ImageUploader uploadImage={uploadImage} />
    </main>
  );
}
