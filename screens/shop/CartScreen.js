import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../constants/colors';
import CartItem from '../../components/shop/CartItem';
import { removeFromCart } from '../../store/actions/cart';
import { addOrder } from '../../store/actions/order';
import Card from '../../UI/Card';

const CartScreen = props => {
  const cartTotalAmount = useSelector(state => state.cart.totalSum);
  const cartItems = useSelector(state => {
    const transformedCarItems = [];
    for (const key in state.cart.items) {
      transformedCarItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCarItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleOrderNow = async () => {
    try {
      setIsLoading(true);
      await dispatch(addOrder(cartItems, cartTotalAmount));
    } catch (error) {
      setError('Someting went wrong');
    }
    setIsLoading(false);
  };
  const dispatch = useDispatch();
  return (
    <View style={styles.screen}>
      <Card style={styles.summery}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Button
            color={colors.accent}
            title="Order now"
            disabled={cartItems.length === 0}
            onPress={handleOrderNow}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            deletable={true}
            quantity={item.quantity}
            title={item.productTitle}
            amount={item.sum}
            onRemove={() => dispatch(removeFromCart(item.productId))}
          />
        )}
        keyExtractor={item => item.productId}
      />
    </View>
  );
};
CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
};
const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summery: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: colors.primary
  }
});
export default CartScreen;
