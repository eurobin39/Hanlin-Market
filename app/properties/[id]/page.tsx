
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { HandThumbUpIcon, HeartIcon, UserIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";
import { getIsLiked } from "@/components/like-Dislike";


export async function getIsOwner(userId: number) {
  const session = await getSession();
  return session.id ? session.id === userId : false;
}


async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
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
        <h1 className="text-2xl font-semibold pb-3">{product.title}</h1>
        <p className="relative p-5 border-2 border-neutral-600 rounded-md w-full auto">
          {product.description}
        </p>
      </div>
      <div className="fixed mx-auto w-full max-w-screen-sm bottom-0 p-5 pb-5 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">€{formatToWon(product.price)}</span>
       

       

      </div>


    </div >

  )
}