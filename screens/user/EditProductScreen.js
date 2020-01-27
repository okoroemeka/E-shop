import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../UI/HeaderButton';
import { createProduct, editProduct } from '../../store/actions/product';
import colors from '../../constants/colors';
import Input from '../../UI/Input';

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
      for (key in updatedInputValidity) {
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
const EditProductScreen = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const editProductId = props.navigation.getParam('productId');
  /* managing state */
  const product = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === editProductId)
  );
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editProductId ? product.title : '',
      imageUrl: editProductId ? product.imageUrl : '',
      description: editProductId ? product.description : '',
      price: ''
    },
    inputValidities: {
      title: editProductId ? true : false,
      imageUrl: editProductId ? true : false,
      description: editProductId ? true : false,
      price: editProductId ? true : false
    },
    formIsValid: editProductId ? true : false
  });
  const dispatch = useDispatch();
  /*
    managing submit handler
 */
  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'okay' }
      ]);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (Boolean(editProductId)) {
        await dispatch(
          editProduct(
            editProductId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          createProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description,
            Number(formState.inputValues.price)
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, [dispatch, editProductId, formState]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured!', error, [{ text: 'okay' }]);
    }
  }, [error]);
  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={'padding'}
      keyboardVerticalOffset={150}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={product ? product.title : ''}
            initiallyValid={!!product}
            required
          />

          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={product ? product.imageUrl : ''}
            initiallyValid={!!product}
            required
          />
          {!Boolean(editProductId) && (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="description"
            errorText="Please enter a valid description"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={product ? product.description : ''}
            initiallyValid={!!product}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
EditProductScreen.navigationOptions = navData => {
  const handleSubmit = navData.navigation.getParam('submit');
  return {
    headerTitle: Boolean(navData.navigation.getParam('productId'))
      ? 'Edit product'
      : 'Add product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={handleSubmit}
          // onPress={handleSubmit => console.log('handle submit')}
        />
      </HeaderButtons>
    )
  };
};
const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default EditProductScreen;
