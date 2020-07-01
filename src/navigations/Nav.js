import React, { Component } from "react";
import {
  StackNavigator,
  DrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  AppRegistry,
} from "react-native";
import ConfigScreen from "../screens/ConfigScreen";
import StatsScreen from "../screens/StatsScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { AppIcon, AppStyles } from "../AppStyles";
import { BottomNav } from "../components/bottomNav";

import { connect } from "react-redux";
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator,
} from "react-navigation-redux-helpers";
import DrawerContainer from "../components/DrawerContainer";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});
const middleware = createReactNavigationReduxMiddleware(
  "root",
  (state) => state.nav
);
/* eslint-disable global-require */
const tabList = [
  {
    text: " Início ",
    redirectLink: "home",
    id: "Home",
    image: AppIcon.images.home,
    selectionImage: AppIcon.images.home,
  },
  {
    text: " Relatórios ",
    redirectLink: "relat",
    id: "Relat",
    image: AppIcon.images.stats,
    selectionImage: AppIcon.images.stats,
  },
  {
    text: " Configurações ",
    redirectLink: "config",
    id: "Config",
    image: AppIcon.images.config,
    selectionImage: AppIcon.images.config,
  },
];

const HomeStack = StackNavigator({
  Início: {
    screen: HomeScreen,
  },
});

const StatsStack = StackNavigator({
  Relatórios: {
    screen: StatsScreen,
  },
});

const ConfigStack = StackNavigator({
  Configurações: {
    screen: ConfigScreen,
  },
});

const tabBarConfiguration = {
  tabBarOptions: {
    style: {
      backgroundColor: "white",
      borderTopWidth: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
    },
  },
  tabBarPosition: "bottom",
  tabBarComponent: BottomNav,
};

const Tab = createBottomTabNavigator(
  {
    home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: tabList[0].text,
        tabBarIcon: ({ focused, tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              marginLeft: 5,
              alignSelf: "center",
            }}
            source={focused ? tabList[0].selectionImage : tabList[0].image}
          />
        ),
      },
    },
    relat: {
      screen: StatsStack,
      navigationOptions: {
        tabBarLabel: tabList[1].text,
        tabBarIcon: ({ focused, tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              marginLeft: 5,
              alignSelf: "center",
            }}
            source={focused ? tabList[1].selectionImage : tabList[1].image}
          />
        ),
      },
    },
    config: {
      screen: ConfigStack,
      navigationOptions: {
        tabBarLabel: tabList[2].text,
        tabBarIcon: ({ focused, tintColor }) => (
          <Image
            style={{
              height: 30,
              width: 30,
              marginLeft: 5,
              alignSelf: "center",
            }}
            source={focused ? tabList[2].selectionImage : tabList[2].image}
          />
        ),
      },
    },
  },
  tabBarConfiguration
);

const DrawerStack = DrawerNavigator(
  {
    Tab: Tab,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 200,
    contentComponent: DrawerContainer,
  }
);

const LoginStack = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Welcome: { screen: WelcomeScreen },
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.color.tint,
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const RootNavigator = createStackNavigator(
  {
    LoginStack: { screen: LoginStack },
    DrawerStack: { screen: DrawerStack },
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "LoginStack",
    transitionConfig: noTransitionConfig,
    navigationOptions: ({ navigation }) => ({
      color: "black",
    }),
  }
);
const styles = StyleSheet.create({
    headerTitleStyle: {
      fontWeight: "bold",
      textAlign: "center",
      alignSelf: "center",
      color: "black",
      flex: 1,
      fontFamily: AppStyles.fontName.main,
    },
  });
const AppWithNavigationState = reduxifyNavigator(RootNavigator, "root");

const mapStateToProps = (state) => ({
  state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);
export { RootNavigator, AppNavigator, middleware };

//AppRegistry.registerComponent("TrixieUiKit", () => TrixieUiKitApp);
