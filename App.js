import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import AppReducer from "./src/reducers";
import { AppNavigator, middleware } from "./src/navigations/AppNavigation";

const store = createStore(AppReducer, applyMiddleware(middleware));

console.disableYellowBox = true;

export default (props) => {
    let [fontsLoaded] = useFonts({
      'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
    });    
    if (!fontsLoaded) {
      return <AppLoading />;
    } else {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}


