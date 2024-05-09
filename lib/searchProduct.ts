"use server"

import db from "./db";


export async function searchProducts(query: string) {

    if (!query.trim()) {
        return [];
    }

    return await db.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }


  export async function searchProperties(query: string) {

    if (!query.trim()) {
        return [];
    }
    
    return await db.home.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
