import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import colors from '../constants/colors';
import { authenticate } from '../store/actions/auth';

const StartUpScreen = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const { userId, token, expiryDate: expiryTime } = transformedData;
      const expiryDate = new Date(expiryTime);
      if (expiryDate <= new Date() || !token || !userId) {
        props.navigation.navigate('Auth');
      }
      props.navigation.navigate('Shop');
      const expirationTime = expiryDate.getTime() - new Date().getTime();
      dispatch(authenticate({ token, userId, expiryTime: expirationTime }));
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StartUpScreen;
