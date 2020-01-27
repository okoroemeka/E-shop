import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../UI/Input';
import Card from '../../UI/Card';
import colors from '../../constants/colors';
import * as authActions from '../../store/actions/auth';

const FORM_IN_UPDATAE = 'FORM_IN_UPDATAE';
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_IN_UPDATAE:
      const updatedInputValues = {
        ...state.inputValues,
        [action.inputName]: action.value
      };
      const updatedInputValidity = {
        ...state.inputValidities,
        [action.inputName]: action.isValid
      };
      let updatedformIsValid = true;
      for (let key in updatedInputValidity) {
        updatedformIsValid = updatedformIsValid && updatedInputValidity[key];
      }
      return {
        formIsValid: updatedformIsValid,
        inputValues: updatedInputValues,
        inputValidities: updatedInputValidity
      };
    default:
      return state;
  }
};
const AuthScreen = props => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  const dispatch = useDispatch();

  const authHandler = async () => {
    try {
      setError(null);
      setLoading(true);
      await dispatch(
        authActions[isSignUp ? 'signUp' : 'login'](
          formState.inputValues.email,
          formState.inputValues.password
        )
      );
      props.navigation.navigate('Shop');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const inputChangeHandler = useCallback(
    (inputName, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_IN_UPDATAE,
        value: inputValue,
        isValid: inputValidity,
        inputName: inputName
      });
    },
    [dispatchFormState]
  );
  useEffect(() => {
    if (Boolean(error)) {
      Alert.alert('Error', error, [{ text: 'okay' }]);
    }
  }, [error]);
  return (
    <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.screen}
        keyboardVerticalOffset={50}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              initailValue=""
              onInputChange={inputChangeHandler}
            />
            <Input
              id="password"
              label="password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initailValue=""
            />
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Button
                  title={`${!isSignUp ? 'Login' : 'Sign Up'}`}
                  color={colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${!isSignUp ? 'Sign Up' : 'Log in'}`}
                color={colors.accent}
                onPress={() => setIsSignUp(prevState => !prevState)}
              />
            </View>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate'
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '90%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1
  },
  buttonContainer: {
    marginTop: 10
  }
});
export default AuthScreen;
