import React from 'react';
import { useDispatch } from 'react-redux';
import * as cartAction from '../../store/actions/cart';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Button
} from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../constants/colors';

const ProductDetailScreen = props => {
  const porductId = props.navigation.getParam('productId');
  const dispatch = useDispatch();
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(product => product.id === porductId)
  );

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={colors.primary}
          title="Add to cart"
          onPress={() => dispatch(cartAction.addToCart(selectedProduct))}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle')
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  price: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
