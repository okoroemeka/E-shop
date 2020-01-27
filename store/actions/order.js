import Order from '../../models/order';
export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDER = 'SET_ORDER';

export const fetchOrder = () => async (dispatch, getState) => {
  try {
    const { userId } = getState().auth;
    const res = await fetch(
      `https://shop-app-3de95.firebaseio.com/orders/${userId}.json`
    );
    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    const resData = await res.json();
    const formatedResData = [];
    for (const key in resData) {
      formatedResData.push(
        new Order(
          key,
          resData[key].cartItems,
          resData[key].totalAmount,
          new Date(resData[key].Date)
        )
      );
    }
    return dispatch({
      type: FETCH_ORDER,
      orderData: formatedResData
    });
  } catch (error) {
    throw error;
  }
};
export const addOrder = (cartItems, totalAmount) => async (
  dispatch,
  getState
) => {
  try {
    const date = new Date();
    const { token, userId } = getState().auth;
    const res = await fetch(
      `https://shop-app-3de95.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          Date: date.toISOString()
        })
      }
    );
    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    return dispatch({
      type: ADD_ORDER,
      orderData: {
        id: res.name,
        items: cartItems,
        amount: totalAmount,
        date: date.toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
};
