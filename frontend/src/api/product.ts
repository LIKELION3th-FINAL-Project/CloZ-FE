export const getProducts = async (cursor?: number) => {
  const res = await fetch(
    `/api/products?cursor=${cursor ?? ""}`
  );
  return res.json();
};