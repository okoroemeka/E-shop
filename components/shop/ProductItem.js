import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import colors from '../../constants/colors';
import Card from '../../UI/Card';

const ProductItem = props => {
  let TouchableCamp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version > 21) {
    TouchableCamp = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCamp onPress={props.onSelect} useForeground={true}>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCamp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    borderRadius: 10,
    backgroundColor: 'white',
    height: 300,
    margin: 20
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 14,
    marginVertical: 4
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888'
  },
  details: {
    alignItems: 'center',
    height: '18%',
    padding: 10
  },
  touchable: {
    overflow: 'hidden'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '22%',
    paddingHorizontal: 20
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  }
});
export default ProductItem;
