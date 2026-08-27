type Blog = {
  id: number;
  name: string;
  slug: string;
  user: string;
};

export default async function BlogsPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
    cache: "no-store",
  });

  const blogs: Blog[] = await response.json();

  return (
    <main>
      {blogs.map((blog) => (
        <p key={blog.id}>
          <a href={`/blogs/${blog.user}/${blog.slug}`}>{blog.name}</a>
        </p>
      ))}
    </main>
  );
}
