import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import colors from '../../constants/colors';
import CartItem from './CartItem';
import Card from '../../UI/Card';
const OrderItem = ({ items, totalAmount, date, cartItem }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summery}>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button
        color={colors.primary}
        title={showDetails ? 'Hide Details' : 'Show Details'}
        onPress={() => setShowDetails(prevState => !prevState)}
      />
      {showDetails && (
        <View style={styles.details}>
          {items.map(cartItem => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              title={cartItem.productTitle}
              amount={cartItem.sum}
            />
          ))}
        </View>
      )}
    </Card>
  );
};
const styles = StyleSheet.create({
  orderItem: {
    borderRadius: 10,
    backgroundColor: 'white',
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  summery: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: '#888'
  },
  details: {
    width: '100%'
  }
});
export default OrderItem;
