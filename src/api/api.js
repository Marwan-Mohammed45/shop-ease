import axios from 'axios';

export const Productsdata = async () => {
  const categories = [
    'smartphones',
    'laptops',
    'lighting',
    'home-decoration',
    'automotive',
    'mens-watches',
    'womens-watches',
    'sunglasses'
  ];

  let allProducts = [];

  for (const category of categories) {
    const res = await axios.get(`https://dummyjson.com/products/category/${category}`);
    allProducts = [...allProducts, ...res.data.products];
  }

  // نفلتر بحيث ناخد أول 200 منتج فقط لو زادوا
  return allProducts.slice(0, 400);
};
