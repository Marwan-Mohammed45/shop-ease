import axios from 'axios';

export const Productsdata = async () => {
    const products = await axios.get("https://fakestoreapi.com/products");
    return products.data;
}

export const CategoriesData = async () => {
    const categories = await axios.get("https://fakestoreapi.com/products/categories");
    return categories.data;
}