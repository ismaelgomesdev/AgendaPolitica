import React from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { connect } from "react-redux";
import {
  DrawerNavigator,
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator,
} from "react-navigation-redux-helpers";
import ConfigScreen from "../screens/ConfigScreen";
import StatsScreen from "../screens/StatsScreen";
import HomeScreen from "../screens/HomeScreen";
import HomeScreen2 from "../screens/HomeScreen2";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { AppIcon, AppStyles } from "../AppStyles";
import { Configuration } from "../Configuration";
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

// login stack
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

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
  },
  {
    initialRouteName: "Home",
    headerMode: "none",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.color.tint,
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const HomeStack2 = createStackNavigator(
  {
    Home: { screen: HomeScreen2 },
  },
  {
    initialRouteName: "Home",
    headerMode: "none",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.color.tint,
      headerTitleStyle: styles.headerTitleStyle,
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const StatsStack = createStackNavigator(
  {
    Relatórios: { screen: StatsScreen },
  },
  {
    initialRouteName: "Relatórios",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.color.tint,
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            {navigation.state.params && navigation.state.params.menuIcon ? (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 5,
                }}
                source={{ uri: navigation.state.params.menuIcon }}
              />
            ) : (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 5,
                }}
                source={AppIcon.images.defaultUser}
              />
            )}

            <Text
              style={{
                fontFamily: AppStyles.fontName.bold,
                color: AppStyles.color.tint,
                fontSize: 19,
                marginTop: 10,
                alignSelf: "stretch",
                textAlign: "left",
                marginLeft: 20,
              }}
            >
              Nome do Candidato
            </Text>
          </TouchableOpacity>
        );
      },
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const ConfigStack = createStackNavigator(
  {
    Configurações: { screen: ConfigScreen },
  },
  {
    initialRouteName: "Configurações",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.color.tint,
      headerTitleStyle: styles.headerTitleStyle,
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            {navigation.state.params && navigation.state.params.menuIcon ? (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 5,
                }}
                source={{ uri: navigation.state.params.menuIcon }}
              />
            ) : (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginLeft: 5,
                }}
                source={AppIcon.images.defaultUser}
              />
            )}

            <Text
              style={{
                fontFamily: AppStyles.fontName.bold,
                color: AppStyles.color.tint,
                fontSize: 19,
                marginTop: 10,
                alignSelf: "stretch",
                textAlign: "left",
                marginLeft: 20,
              }}
            >
              Nome do Candidato
            </Text>
          </TouchableOpacity>
        );
      },
    }),
    cardStyle: { backgroundColor: "#FFFFFF" },
  }
);

const TabNavigatorC = createBottomTabNavigator(
  {
    Início: { screen: HomeStack },
    Relatórios: { screen: StatsStack },
    Configurações: { screen: ConfigStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Início") {
          iconName = AppIcon.images.home;
        }
        if (routeName === "Relatórios") {
          iconName = AppIcon.images.stats;
        }
        if (routeName === "Configurações") {
          iconName = AppIcon.images.config;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Image
            style={{
              tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
            }}
            source={iconName}
          />
        );
      },
      params: { nomeLogado: "teste" },
    }),
    initialLayout: {
      height: 300,
    },
    tabBarOptions: {
      activeTintColor: AppStyles.color.tint,
      inactiveTintColor: "gray",
      style: {
        height: Configuration.home.tab_bar_height,
      },
    },
  }
);

const TabNavigatorL = createBottomTabNavigator(
  {
    Início: { screen: HomeStack2 },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Início") {
          iconName = AppIcon.images.home;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Image
            style={{
              tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
            }}
            source={iconName}
          />
        );
      },
      params: { nomeLogado: "teste" },
    }),
    initialLayout: {
      height: 300,
    },
    tabBarOptions: {
      activeTintColor: AppStyles.color.tint,
      inactiveTintColor: "gray",
      style: {
        height: Configuration.home.tab_bar_height,
      },
    },
  }
);

// drawer stack
const DrawerStackC = DrawerNavigator(
  {
    Tab: TabNavigatorC,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 200,
    contentComponent: DrawerContainer,
  }
);
const DrawerStackL = DrawerNavigator(
  {
    Tab: TabNavigatorL,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 200,
    contentComponent: DrawerContainer,
  }
);

// Manifest of possible screens
const RootNavigator = createStackNavigator(
  {
    LoginStack: { screen: LoginStack },
    DrawerStackC: { screen: DrawerStackC },
    DrawerStackL: { screen: DrawerStackL },
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

const AppWithNavigationState = reduxifyNavigator(RootNavigator, "root");

const mapStateToProps = (state) => ({
  state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

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

export { RootNavigator, AppNavigator, middleware };
