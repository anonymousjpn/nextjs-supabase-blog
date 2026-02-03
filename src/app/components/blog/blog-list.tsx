import { notFound } from "next/navigation";
import { createClient } from "../../../../utils/supabase-server";
import BlogItem from "./blog-item"
import type { Database } from "../../../../utils/database.types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type userData = Database["public"]["Tables"]["profiles"]["Row"];

//ブログリスト
const BlogList = async () => {
    const supabase = createClient();
    //ブログリスト取得
    const { data } = await supabase
        .from("blogs")
        .select()
        .order('created_at', { ascending: false })
    const blogsData = data as Blog[] | null;
    //ブログが見つからない場合
    if (!blogsData) return notFound()
    return (
        <div className="grid grid-cols-3 gap-5">
            {/*mapでasync/awaitを使用するためPromise.allを使用 */}
            {await Promise.all(
                blogsData.map(async (blogData) => {
                    //プロフィール取得
                    const { data:userData } = await supabase
                        .from("profiles")
                        .select()
                        .eq("id",blogData.user_id)
                        .single<userData>()
                    //ブログとプロフィールのテーブルを結合
                    const blog = {
                        id: blogData.id,
                        created_at: blogData.created_at,
                        title: blogData.title,
                        content: blogData.content,
                        user_id: blogData.user_id,
                        image_url: blogData.image_url,
                        name: userData!.name,
                        avatar_url: userData!.avatar_url
                    }
                    return <BlogItem key={blog.id} {...blog} />
                })
            )}
        </div>
    )
}

export default BlogList;