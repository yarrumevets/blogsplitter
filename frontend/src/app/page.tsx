import { revalidatePath } from "next/cache";

type Post = {
  id: number;
  title: string;
  body_html: string;
  created_at: string;
};

async function createPost(formData: FormData) {
  "use server";

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: String(formData.get("title") ?? ""),
      body_html: String(formData.get("body_html") ?? ""),
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
