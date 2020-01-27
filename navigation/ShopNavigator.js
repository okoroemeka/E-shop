import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerNavigatorItems
} from 'react-navigation-drawer';
import { Platform, View, Button, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrderScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import { logout } from '../store/actions/auth';
import colors from '../constants/colors';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : colors.primary
};
const ProductsNavigator = createStackNavigator(
  {
    productsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions
  }
);
const OrderNavigator = createStackNavigator(
  {
    Orders: OrderScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions
  }
);
const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions
  }
);
const shopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrderNavigator,
    Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 10 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <Button
              title="Log out"
              color={colors.primary}
              onPress={() => {
                dispatch(logout());
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);
const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavigationOptions
  }
);
const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: shopNavigator
});
export default createAppContainer(MainNavigator);
