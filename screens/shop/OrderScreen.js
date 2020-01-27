import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrder } from '../../store/actions/order';
import colors from '../../constants/colors';

const OrderScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);

  const handleFetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchOrder());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch]);
  useEffect(() => {
    handleFetchOrders();
  }, [handleFetchOrders]);
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (Boolean(error)) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>An error occured.</Text>
    </View>;
  }
  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You have no order, place one.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <OrderItem
          totalAmount={item.totalAmount}
          date={item.readableDate}
          items={item.items}
        />
      )}
    />
  );
};
OrderScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    )
  };
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default OrderScreen;
