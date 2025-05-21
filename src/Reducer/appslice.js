import { createSlice } from "@reduxjs/toolkit";

// الحالة الأولية
const initialState = {
  cart: [], // قائمة المنتجات في السلة
  wishlist: {}, // قائمة المفضلة (كائن لتسهيل البحث)
  recentViewed: [] // المنتجات التي تم مشاهدتها مؤخراً
};

// إنشاء الـ slice
export const appSlice = createSlice({
  name: "ecommerce", // اسم الـ slice

  // حالة البداية
  initialState,

  // الـ Reducers
  reducers: {
    // إضافة منتج إلى السلة
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // إذا كان المنتج موجوداً، نزيد الكمية فقط
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        // إذا كان جديداً، نضيفه مع كمية افتراضية 1
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }
    },

    // إزالة منتج من السلة
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },

    // تحديث كمية منتج في السلة
    updateQuantity: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    // إفراغ السلة بالكامل
    clearCart: (state) => {
      state.cart = [];
    },

    // إضافة/إزالة من المفضلة
    toggleWishlist: (state, action) => {
      const { id } = action.payload;
      if (state.wishlist[id]) {
        delete state.wishlist[id]; // إزالة إذا كان موجوداً
      } else {
        state.wishlist[id] = action.payload; // إضافة إذا كان غير موجود
      }
    },

    // إضافة منتج للمشاهدات الأخيرة
    addToRecentViewed: (state, action) => {
      // تجنب التكرار
      if (!state.recentViewed.some(item => item.id === action.payload.id)) {
        // حفظ فقط آخر 5 منتجات
        if (state.recentViewed.length >= 5) {
          state.recentViewed.pop();
        }
        state.recentViewed.unshift(action.payload);
      }
    }
  },
});

// تصدير الـ actions
export const { 
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  addToRecentViewed
} = appSlice.actions;

// تصدير الـ reducer
export default appSlice.reducer;

// دالة مساعدة لحساب المجموع الكلي
export const selectTotal = (state) => {
  return state.ecommerce.cart.reduce((total, item) => 
    total + (item.price * item.quantity), 0);
};

// دالة مساعدة لعدد العناصر في السلة
export const selectCartCount = (state) => {
  return state.ecommerce.cart.reduce((count, item) => 
    count + item.quantity, 0);
};