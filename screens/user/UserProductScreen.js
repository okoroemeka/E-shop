import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Button,
  Platform,
  Alert,
  ActivityIndicator,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import colors from '../../constants/colors';
import { deleteProductAdmin } from '../../store/actions/product';

const UserProducts = props => {
  const userProductData = useSelector(state => state.products.userProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };
  // this is where you stopped. Add loader when delete Item is dispatched.
  handleDispatchDeleteItem = useCallback(
    async id => {
      try {
        setIsLoading(true);
        await dispatch(deleteProductAdmin(id));
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
    [dispatch]
  );
  const deleteProductHandler = id => {
    Alert.alert('Are you sure', 'Do you want to delete this item', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => handleDispatchDeleteItem(id)
      }
    ]);
  };
  if (Boolean(error)) {
    return Alert.alert('Delete error', 'Error occured', [
      { text: 'Ok', style: 'default' }
    ]);
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (userProductData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You have no product, order one.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={userProductData}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ProductItem
          image={item.imageUrl}
          title={item.title}
          price={item.price}
          onSelect={() => editProductHandler(item.id)}
        >
          <Button
            color={colors.primary}
            title="Edit"
            onPress={() => editProductHandler(item.id)}
          />
          <Button
            color={colors.primary}
            title="Delete"
            onPress={deleteProductHandler.bind(this, item.id)}
          />
        </ProductItem>
      )}
    />
  );
};
UserProducts.navigationOptions = navData => {
  return {
    headerTitle: 'Your product',
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
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => navData.navigation.navigate('EditProduct')}
        />
      </HeaderButtons>
    )
  };
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
export default UserProducts;
