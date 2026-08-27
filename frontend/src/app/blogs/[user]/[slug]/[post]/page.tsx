type Post = {
  id: number;
  title: string;
  body_html: string;
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ user: string; slug: string; post: string }>;
}) {
  const { user, slug, post } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/${user}/${slug}/${post}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load post");
  }

  const data: Post = await response.json();

  return (
    <main>
      <h1>{data.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: data.body_html }} />
    </main>
  );
}
