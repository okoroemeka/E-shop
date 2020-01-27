import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import reduxThunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { enableScreens } from 'react-native-screens';
import ProductReducer from './store/reducers/product';
import ShopNavigator from './navigation/ShopNavigator';
import CartReducer from './store/reducers/cart';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./fonts/OpenSans-Bold.ttf')
  });
};
enableScreens();
const rootReducer = combineReducers({
  products: ProductReducer,
  cart: CartReducer,
  orders: orderReducer,
  auth: authReducer
});
// const store = createStore(rootReducer, composeWithDevTools());
const store = createStore(rootReducer, applyMiddleware(reduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
