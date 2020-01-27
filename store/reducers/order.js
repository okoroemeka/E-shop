import { ADD_ORDER, FETCH_ORDER } from '../actions/order';
import Order from '../../models/order';
const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDER:
      return {
        orders: action.orderData
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
    default:
      return state;
  }
};
