type Post = {
  id: number;
  title: string;
  body_html: string;
  tags: string[];
};

type Blog = {
  id: number;
  name: string;
  slug: string;
  required_tags: string[];
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}/posts`,
    { cache: "no-store" },
  );

  const { blog, posts }: { blog: Blog; posts: Post[] } = await response.json();

  return (
    <main>
      <h1>{blog.name}</h1>

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.body_html }} />
          <small>{post.tags.join(", ")}</small>
        </article>
      ))}
    </main>
  );
}
