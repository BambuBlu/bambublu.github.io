import { getAllPosts } from "@/lib/posts";
import BlogClient from "./BlogClient";

export default function BlogIndex() {
  const posts = getAllPosts();
  return <BlogClient posts={posts} />;
}