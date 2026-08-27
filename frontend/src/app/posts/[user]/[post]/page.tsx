type Post = {
  id: number;
  title: string;
  body_html: string;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ user: string; post: string }>;
}) {
  const { user, post } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${user}/${post}`,
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
