import { revalidatePath } from "next/cache";

type Post = {
  id: number;
  title: string;
  body_html: string;
  created_at: string;
  tags: string[];
};

async function createPost(formData: FormData) {
  "use server";

  let bodyHtml = String(formData.get("body_html") ?? "");

  // Image.
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const uploadData = new FormData();
    uploadData.append("image", image);
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
      {
        method: "POST",
        body: uploadData,
      },
    );
    const { url } = await uploadResponse.json();
    bodyHtml += `<p><img src="${url}" alt=""></p>`;
  }

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

export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    cache: "no-store",
  });

  const posts: Post[] = await response.json();

  return (
    <main>
      <form action={createPost}>
        <input name="title" placeholder="Title" required />
        <textarea name="body_html" placeholder="Post body" required />
        <input type="file" name="image" accept="image/*" />
        <input name="tags" placeholder="Tags, comma separated" />
        <button type="submit">Create post</button>
      </form>

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.body_html }} />
        </article>
      ))}
    </main>
  );
}
