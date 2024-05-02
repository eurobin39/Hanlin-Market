
import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { HandThumbUpIcon, HeartIcon, UserIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";
import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";
import { getIsHomeSaved, getIsLiked } from "@/components/like-Dislike";
import React from 'react';
import ClientOnlySwiper from '@/components/slidePhotos';
import AddChatButton from "./addChatButton";
import PropertyDeleteButton from "./delete.button";





export async function getIsOwner(userId: number) {
  const session = await getSession();
  return session.id ? session.id === userId : false;
}


async function getProperty(id: number) {
  const property = await db.home.findUnique({
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
          saved: true,
        }
      }
    },
  });
  return property;
};



export default async function propertyDetail({ params
}: {
  params: { id: string };
}
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }
  const property = await getProperty(id);
  if (!property) {
    return notFound();
  }
  const isOwner = await getIsOwner(property.userId); // 실제 구조에 맞게 조정

  const likePost = async () => {
    "use server";
    const session = await getSession();
    try {
      await db.saved.create({
        data: {
          homeId: id,
          userId: session.id!,
        },
      });
      revalidatePath(`/properties/${id}`);
    } catch (e) { }
  };
  const dislikePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.saved.delete({
        where: {
          id: {
            homeId: id,
            userId: session.id!,
          },
        },
      });
      revalidatePath(`/properties/${id}`);
    } catch (e) { }
  };
  const isSaved = await getIsHomeSaved(id);


  return (

    <div>
      <div className="relative aspect-square">
        {property.photos && property.photos.length > 0 ? (
          <ClientOnlySwiper photos={property.photos} />
        ) : (
          <Image fill src="/images/default-image.jpg" className="object-cover" alt="Default Property" />
        )}
        <div className="absolute top-5 left-5 z-50 flex items-center justify-center p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100">
          <Link href="/property">
            <ChevronLeftIcon className="h-5 w-5 text-neutral-600" />
          </Link>
        </div>
        <div className="absolute top-5 right-5 z-50 flex items-center justify-center p-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100">
          <Link href="">
            <ExclamationTriangleIcon className="h-5 w-5 text-neutral-600" />
          </Link>
        </div>
      </div>

      <div className="p-5 flex items-center gap-3 border-b border-neutral-700 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full">
            {property.user.avatar !== null ?
              <Image className="rounded-full" src={property.user.avatar} width={40} height={40} alt={property.user.username} /> :
              <UserIcon />}
          </div>
          <div>
            <h3>{property.user.username}</h3>
          </div>
        </div>

        <div>
          <form action={isSaved ? dislikePost : likePost}>
            <button
              className={`flex items-center gap-2 ${isSaved ? "text-red-500" : "text-neutral-400"} border border-neutral-400 rounded-full p-2 hover:bg-neutral-800 transition-colors`}
            >
              <BookmarkIcon className="size-5" />
              <span>Save({property._count.saved})</span>
            </button>
          </form>
        </div>
      </div>

      <div className="p-5 mb-16">
        <h1 className="text-2xl font-semibold pb-3">{property.title}</h1>
        <p className="relative p-5 border-2 border-neutral-600 rounded-md w-full auto">
          {property.description}
        </p>
      </div>
      <div className="fixed mx-auto w-full max-w-screen-sm bottom-0 p-5 pb-5 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-lg">€{formatToWon(property.price)}</span>
        {isOwner ? <PropertyDeleteButton propertyId={property.id} /> : null}

        <AddChatButton propertyId={property.id} />



      </div>


    </div >

  )
}