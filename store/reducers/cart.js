import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { DELETE_PRODUCT_ADMIN } from '../actions/product';
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from '../actions/order';
const initialState = {
  items: {},
  totalSum: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;
      let updatedOrNewItem;
      if (state.items[addedProduct.id]) {
        updatedOrNewItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
      } else {
        updatedOrNewItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewItem },
        totalSum: state.totalSum + productPrice
      };
    case REMOVE_FROM_CART:
      const item = state.items[action.pid];
      const updatedTotalSum = state.totalSum - item.productPrice;
      let updatedCartItems;
      if (item.quantity > 1) {
        const updatedCartItem = new CartItem(
          item.quantity - 1,
          item.productPrice,
          item.productTitle,
          item.sum - item.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalSum: updatedTotalSum
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT_ADMIN:
      if (!state.items[action.itemId]) {
        return state;
      }
      const itemTotal = state.items[action.itemId].sum;
      const newItem = { ...state.items };
      delete newItem[action.itemId];
      return {
        ...state,
        items: newItem,
        totalSum: state.totalSum - itemTotal
      };
  }
  return state;
};
