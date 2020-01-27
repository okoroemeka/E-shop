import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Button,
  Platform,
  View,
  StyleSheet,
  ActivityIndicator,
  Text
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartAction from '../../store/actions/cart';
import { fetchProduct } from '../../store/actions/product';
import colors from '../../constants/colors';

const ProductOverviewScreen = props => {
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);
      await dispatch(fetchProduct());
    } catch (error) {
      setError(error.message);
    }
    setRefreshing(false);
  }, [dispatch, setRefreshing, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);
  useEffect(() => {
    setLoading(true);
    loadProducts().then(() => {
      setLoading(false);
    });
  }, [dispatch, loadProducts]);
  const handleSelect = (title, id) => {
    return props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };
  if (Boolean(error)) {
    return (
      <View style={styles.indcator}>
        <Text>An error occured</Text>
        <Button title="try again" onPress={loadProducts} />
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.indcator}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!loading && products.length == 0) {
    return (
      <View style={styles.indcator}>
        <Text>There was no product found</Text>
      </View>
    );
  }
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={({ item }) => (
        <ProductItem
          image={item.imageUrl}
          price={item.price}
          title={item.title}
          onSelect={() => handleSelect(item.title, item.id)}
        >
          <Button
            color={colors.primary}
            title="View Details"
            onPress={() => handleSelect(item.title, item.id)}
          />
          <Button
            color={colors.primary}
            title="To Cart"
            onPress={() => dispatch(cartAction.addToCart(item))}
          />
        </ProductItem>
      )}
    />
  );
};

ProductOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => navData.navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => navData.navigation.navigate('Cart')}
        />
      </HeaderButtons>
    )
  };
};
const styles = StyleSheet.create({
  indcator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default ProductOverviewScreen;
