import db from "@/lib/db"
import ListProduct from "@/components/list-products";

export async function getProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_At: true,
            photo: true,
            id: true,
        }

    });
    return products;
}

export default async function Products() {
    const products = await getProducts();
    return (
        <div className="py-20">
            <div>
                {products.map((product) => (<ListProduct key={product.id}
                    {...product} />))}
            </div>
        </div>

    )
}