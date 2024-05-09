
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { HandThumbUpIcon, HeartIcon, UserIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ProductDeleteButton from "./delete.button";
import AddChatButton from "./addChatButton";
import { revalidatePath } from "next/cache";
import { getIsLiked } from "@/components/like-Dislike";
import ProductPage from "./popup";


export async function getIsOwner(userId: number) {
  const session = await getSession();
  return session.id ? session.id === userId : false;
}


async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      photo: true,
      userId: true,
      price: true,
      status: true,
      ChatRooms: true,
      Category: {
        select: {
          name: true,
        }
      },
      user: {
        select: {
          username: true,
          avatar: true,
          reputationScore: true,
        },
      },
      _count: {
        select: {
          like: true,
        }
      }
    },
  });
  return product;
};



export default async function productDetail({ params
}: {
  params: { id: string };
}
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId); // 실제 구조에 맞게 조정

  const likePost = async () => {
    "use server";
    const session = await getSession();
    try {
      await db.like.create({
        data: {
          productId: id,
          userId: session.id!,
        },
      });
      revalidatePath(`/products/${id}`);
    } catch (e) { }
  };
  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            productId: id,
            userId: session.id!,
          },
        },
      });
      revalidatePath(`/products/${id}`);
    } catch (e) { }
  };

  const isLiked = await getIsLiked(id);


  const isCompleted = product.status === "COMPLETED";

  const scorePercentage = (product.user.reputationScore / 100) * 100;

  const getGaugeColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-purple-500 via-blue-500 to-red-500 animate-pulse";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const gaugeClass = getGaugeColor(product.user.reputationScore);

  return (



    <div>

      <div className="relative aspect-square">
        <Image fill src={`${product.photo}/public`} className="object-cover" alt={product.title} />
        <div className="absolute top-5 left-5 z-50 flex items-center justify-center p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100">
          <Link href="/home">
            <ChevronLeftIcon className="h-5 w-5 text-neutral-600" />
          </Link>
        </div>
        <div className="absolute top-5 right-5 z-50 flex items-center justify-center p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100">
          <Link href={''}>
            <ExclamationTriangleIcon className="h-5 w-5 text-neutral-600" />
          </Link>
        </div>

      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full">
            {product.user.avatar !== null ?
              <Image className="rounded-full" src={product.user.avatar} width={40} height={40} alt={product.user.username} /> :
              <UserIcon />}
          </div>
          <div>
            <h3>{product.user.username}</h3>
            <div className="w-28 h-2 bg-gray-300 rounded-full overflow-hidden mt-1">
              <div className={`h-full ${gaugeClass} rounded-l-full transition-all duration-300`} style={{ width: `${scorePercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div>
          <form action={isLiked ? dislikePost : likePost}>
            <button
              className={`flex items-center gap-2 ${isLiked ? "text-red-500" : "text-neutral-400"} border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
            >
              <HeartIcon className="size-5" />
              <span>Like({product._count.like})</span>
            </button>
          </form>
        </div>
      </div>

      <div className="p-5 mb-16">
        <h1 className="text-2xl font-semibold pb-2">{product.title}</h1>
        <h2 className="text-sm text-gray-500 bg-white bg-opacity-80 py-1 px-2 rounded inline-block mb-1">
          #{product.Category?.name}
        </h2>
        <p className="relative p-5 border-2 border-neutral-600 rounded-md w-full auto">
          {product.description}
        </p>
      </div>
      <div className="fixed mx-auto w-full max-w-screen-sm bottom-0 p-5 pb-5 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">€{formatToWon(product.price)}</span>
        {isOwner ? <ProductDeleteButton productId={product.id} /> : null}
        {isOwner ? <ProductPage productId={product.id} /> : null}
        {isCompleted ? null : <AddChatButton productId={product.id} />}


      </div>


    </div >

  )
}