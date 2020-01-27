import PRODUCTS from '../../data/dummy-data';
import Product from '../../models/product';
import {
  DELETE_PRODUCT_ADMIN,
  CREATE_PRODUCT,
  EDIT_PRODUCT,
  FETCH_PRODUCT
} from '../actions/product';
const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      return {
        ...state,
        availableProducts: action.productData,
        userProducts: action.userProduct
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };
    case EDIT_PRODUCT:
      const productId = action.productId;
      const productToUpdate = [...state.userProducts];
      const availableProductsToUpdate = [...state.availableProducts];
      const index1 = productToUpdate.findIndex(
        element => element.id === productId
      );
      const index2 = availableProductsToUpdate.findIndex(
        element => element.id === productId
      );
      const updatedProd = {
        ...availableProductsToUpdate[index1],
        title: action.productData.title,
        imageUrl: action.productData.imageUrl,
        description: action.productData.description
      };
      productToUpdate[index1] = updatedProd;
      availableProductsToUpdate[index2] = updatedProd;
      return {
        ...state,
        availableProducts: availableProductsToUpdate,
        userProducts: productToUpdate
      };
    case DELETE_PRODUCT_ADMIN:
      const prodToUpdate = [...state.userProducts];
      const updateUserProduct = prodToUpdate.filter(
        product => product.id !== action.itemId
      );
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.itemId
        ),
        userProducts: updateUserProduct
      };

    default:
      break;
  }
  return state;
};
