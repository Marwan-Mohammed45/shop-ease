import { configureStore } from "@reduxjs/toolkit";
import appReducer from './appslice';

const store = configureStore({
    reducer: {
        appReducer, // قم باستخدام اسم الـ reducer هنا مباشرة
    },
});

export default store;