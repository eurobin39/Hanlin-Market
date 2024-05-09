import TabBar from "@/components/originalTAB";
import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/20/solid";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: "Community",
};

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="p-2 flex flex-col mt-20">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.id}`}
          className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
        >
          <h2 className="text-white text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <div className="fixed bottom-32 w-full mx-auto max-w-screen-sm flex items-center
             justify-centerpx-5 py-">
                <Link href="/community/add" className="bg-emerald-500 flex items-center justify-center
            rounded-full size-16 absolute right-12 text-white transition-colors hover:bg-emerald-400 ">
                    <PlusIcon className="size-10" />
                </Link>
            </div>

    </div>
  );
}