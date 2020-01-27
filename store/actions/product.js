import Product from '../../models/product';

export const DELETE_PRODUCT_ADMIN = 'DELETE_PRODUCT_ADMIN';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const FETCH_PRODUCT = 'FETCH_PRODUCT';

export const deleteProductAdmin = id => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const res = await fetch(
      `https://shop-app-3de95.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );
    if (!res.ok) {
      throw new Error('an error occured');
    }
    dispatch({
      type: DELETE_PRODUCT_ADMIN,
      itemId: id
    });
  } catch (error) {
    throw error;
  }
};

export const fetchProduct = () => async (dispatch, getState) => {
  try {
    const { userId } = getState().auth;
    const res = await fetch(
      'https://shop-app-3de95.firebaseio.com/products.json'
    );
    if (!res.ok) {
      throw new Error('Something happened,please try again');
    }
    const resData = await res.json();
    const products = [];
    for (const key in resData) {
      products.push(
        new Product(
          key,
          resData[key].ownerId,
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].price
        )
      );
    }
    const userProduct = products.filter(product => product.ownerId === userId);
    dispatch({ type: FETCH_PRODUCT, productData: products, userProduct });
  } catch (error) {
    throw error;
  }
};
export const createProduct = (title, imageUrl, description, price) => async (
  dispatch,
  getState
) => {
  try {
    const { token, userId } = getState().auth;
    const res = await fetch(
      `https://shop-app-3de95.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          imageUrl,
          price,
          description,
          ownerId: userId
        })
      }
    );
    if (!res.ok) {
      throw new Error('someting happened');
    }
    const resData = await res.json();
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        imageUrl,
        price,
        description,
        ownerId: userId
      }
    });
  } catch (error) {
    throw error;
  }
};

export const editProduct = (id, title, description, imageUrl) => async (
  dispatch,
  getState
) => {
  try {
    const res = await fetch(
      `https://shop-app-3de95.firebaseio.com/products/${id}.json?auth=${
        getState().auth.token
      }`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );
    if (!res.ok) {
      throw new Error('something happened');
    }
    dispatch({
      type: EDIT_PRODUCT,
      productId: id,
      productData: { title, description, imageUrl }
    });
  } catch (error) {
    throw error;
  }
};
