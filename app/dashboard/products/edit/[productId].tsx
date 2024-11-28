import { useRouter } from "next/navigation";
import prisma from "@/app/utils/db";

const STYLE = `border-2 border-black mx-1 p-1 drop-shadow-md rounded-md`;

export default function EditProduct({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();

  async function updateProduct(formData: FormData) {
    "use server";

    const updatedName = formData.get("name") as string;
    const updatedPrice = parseFloat(formData.get("price") as string);
    const updatedImageUrl = formData.get("imageUrl") as string;
    const updatedLikes = parseInt(formData.get("likes") as string, 10);

    // Update product in the database
    await prisma.product.update({
      where: { id: Number(params.productId) },
      data: {
        name: updatedName,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        likes: updatedLikes,
      },
    });

    // Redirect back to product dashboard
    router.push("/dashboard/products");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form action={updateProduct}>
        <div>
          <label>
            Name:
            <input
              className={STYLE}
              type="text"
              name="name"
              placeholder="Enter Product Name"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              className={STYLE}
              type="number"
              name="price"
              placeholder="Enter Product Price"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Image URL:
            <input
              className={STYLE}
              type="text"
              name="imageUrl"
              placeholder="Enter Image URL"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Likes:
            <input
              className={STYLE}
              type="number"
              name="likes"
              placeholder="Enter Number of Likes"
              required
            />
          </label>
        </div>
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
