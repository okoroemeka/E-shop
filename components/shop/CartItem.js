import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = ({ onRemove, quantity, title, amount, deletable }) => {
  return (
    <View style={styles.CartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{quantity}</Text>
        <Text style={styles.mainText}>{title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${amount.toFixed(2)}</Text>
        {deletable && (
          <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
            <Ionicons
              name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CartItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
    marginRight: 10
  },
  mainText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  deleteButton: {
    marginHorizontal: 20
  }
});
export default CartItem;
