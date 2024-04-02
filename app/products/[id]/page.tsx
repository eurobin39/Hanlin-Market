async function getProuct(){
    await new Promise(resolve => setTimeout
    (resolve, 10000));
}

export default async function productDetail({params: {id},
}: {
    params: {id:string};
}
){
    const product = await getProuct();
    return (
        <span> Product Detail of {id}! </span>
    )
}