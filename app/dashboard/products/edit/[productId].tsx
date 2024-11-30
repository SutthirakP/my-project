import { useRouter } from "next/navigation";
import prisma from "@/app/utils/db";

const STYLE = `border-2 border-black mx-1 p-1 drop-shadow-md rounded-md`;

export default async function EditProduct({ params }: { params: { productId: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.productId) },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form method="POST" action={`/api/products/${params.productId}`}>
        <label>
          Name:
          <input
            className="border rounded p-2"
            type="text"
            name="name"
            defaultValue={product.name}
            required
          />
        </label>
        <label>
          Price:
          <input
            className="border rounded p-2"
            type="number"
            name="price"
            defaultValue={product.price}
            required
          />
        </label>
        <label>
          Image URL:
          <input
            className="border rounded p-2"
            type="text"
            name="imageUrl"
            defaultValue={product.imageUrl}
            required
          />
        </label>
        <label>
          Likes:
          <input
            className="border rounded p-2"
            type="number"
            name="likes"
            defaultValue={product.likes}
            required
          />
        </label>
        <label>
          Is New:
          <input
            className="border rounded p-2"
            type="checkbox"
            name="isNew"
            defaultChecked={product.isNew}
          />
        </label>
        <label>
          Category:
          <input
            className="border rounded p-2"
            type="text"
            name="category"
            defaultValue={product.category}
          />
        </label>
        <label>
          Brand:
          <input
            className="border rounded p-2"
            type="text"
            name="brand"
            defaultValue={product.brand}
          />
        </label>
        <label>
          Scale:
          <input
            className="border rounded p-2"
            type="text"
            name="scale"
            defaultValue={product.scale}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
