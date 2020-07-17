import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "react-native-button";
import { AppStyles } from "../AppStyles";
//import firebase from "react-native-firebase";
import api from "../services/api";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { TextInputMask } from "react-native-masked-text";
import { AsyncStorage } from "react-native";
import { normalize } from "./StatsScreen";
import { useState, useEffect } from "react";
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      telefone: "",
      senha: "",
      errorMessage: null,
      mensagem: "",
      offset: new Animated.ValueXY({ x: 0, y: 80 }),
    };
    this.unsubscribe = null;
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  componentDidMount() {
    Animated.spring(this.state.offset.y, {
      toValue: 0,
      speed: 4,
      bounciness: 30,
    }).start();
    NetInfo.fetch().then((state) => {
      if (!state.isInternetReachable) {
        this.setState({
          errorMessage:
            "Você está sem internet. Conecte-se para poder acessar.",
        });
      }
    });
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  handleConnectivityChange = (state) => {
    if (state.isInternetReachable) {
      this.setState({
        errorMessage: null,
      });
    } else {
      this.setState({
        errorMessage: "Você está sem internet. Conecte-se para poder acessar.",
      });
    }
    console.log(state.isConnected ? "connected" : "not connected");
  };
  componentWillMount() {
    const { navigation } = this.props;
    this.getToken()
      .then((res) => {
        if (res != false) {
          navigation.dispatch({ type: res, user: null });
        } else {
        }
      })
      .catch((err) => alert("Erro: " + err));
  }

  onPressLogin = async () => {
    const { telefone, senha } = this.state;
    if (telefone.length <= 0 || senha.length <= 0) {
      this.setState({ errorMessage: "Por favor, preencha todos os dados." });
    } else {
      try {
        const response = await api.post("/V_User.php", {
          tipo: "2",
          telefone,
          senha,
        });
        if (response.data != null) {
          const { token, tipo } = response.data;
          console.log(response.data);
          //console.log(qrkey)
          await AsyncStorage.setItem("@PoliNet_token", token);
          await AsyncStorage.setItem("@PoliNet_tipo", tipo);
          //console.log(AsyncStorage.getItem('@InvestSe_token'))
          //this.props.navigation.navigate("AppNavigator", {keyRef: qrkey});
          const { navigation } = this.props;
          if (tipo == "candidato") {
            navigation.dispatch({ type: "LoginC", user: null });
          } else {
            navigation.dispatch({ type: "LoginL", user: null });
          }
        } else {
          this.setState({ errorMessage: "Dados incorretos. Tente novamente." });
        }
      } catch (err) {}
    }
    /*firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const { navigation } = this.props;
        user_uid = response.user._user.uid;
        firebase
          .firestore()
          .collection("users")
          .doc(user_uid)
          .get()
          .then(function(user) {
            if (user.exists) {
              AsyncStorage.setItem("@loggedInUserID:id", user_uid);
              AsyncStorage.setItem("@loggedInUserID:key", email);
              AsyncStorage.setItem("@loggedInUserID:password", password);
              navigation.dispatch({ type: "Login", user: user });
            } else {
              alert("User does not exist. Please try again.");
            }
          })
          .catch(function(error) {
            const { code, message } = error;
            alert(message);
          });
      })
      .catch(error => {
        const { code, message } = error;
        alert(message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
      */
  };

  /*onPressFacebook = () => {
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "user_friends",
      "email"
    ]).then(
      result => {
        if (result.isCancelled) {
          alert("Whoops!", "You cancelled the sign in.");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              data.accessToken
            );
            const accessToken = data.accessToken;
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(result => {
                var user = result.user;
                AsyncStorage.setItem(
                  "@loggedInUserID:facebookCredentialAccessToken",
                  accessToken
                );
                AsyncStorage.setItem("@loggedInUserID:id", user.uid);
                var userDict = {
                  id: user.uid,
                  fullname: user.displayName,
                  email: user.email,
                  profileURL: user.photoURL
                };
                var data = {
                  ...userDict,
                  appIdentifier: "rn-android-universal-listings"
                };
                firebase
                  .firestore()
                  .collection("users")
                  .doc(user.uid)
                  .set(data);
                this.props.navigation.dispatch({
                  type: "Login",
                  user: userDict
                });
              })
              .catch(error => {
                alert("Please try again! " + error);
              });
          });
        }
      },
      error => {
        Alert.alert("Sign in error", error);
      }
    );
  };*/
  getToken = async () => {
    const token = await AsyncStorage.getItem("@PoliNet_token");
    const tipo = await AsyncStorage.getItem("@PoliNet_tipo");
    if (token != null) {
      if (tipo == "candidato") {
        return "LoginC";
      } else {
        return "LoginL";
      }
    } else {
      return false;
    }
    this.setState({ mensagem: token + " " + tipo });
  };
  render() {
    let backColor;
    if (this.state.errorMessage != null) {
      backColor = "#FCCB0A";
    } else {
      backColor = "transparent";
    }
    return (
      <KeyboardAvoidingView style={styles.background}>
        <LinearGradient
          colors={["transparent", "#EDEEF0"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: Dimensions.get("window").height + 50,
          }}
        />

        <Image
          source={require("../assets/images/carregamento.png")}
          style={{ maxHeight: 205, maxWidth: 120 }}
        ></Image>

        <Text style={[styles.title, styles.leftTitle]}>
          Insira seus dados para continuar
          {this.state.mensagem}
        </Text>
        <Animated.View
          style={[
            styles.InputContainer,
            {
              transform: [{ translateY: this.state.offset.y }],
            },
          ]}
        >
          {/*<TextInput
            style={styles.body}
            placeholder="Telefone"
            onChangeText={text => this.setState({ telefone: text })}
            value={this.state.telefone}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />*/}
          <TextInputMask
            style={styles.body}
            placeholder="Telefone"
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
            type={"cel-phone"}
            options={{
              maskType: "BRL",
              withDDD: true,
              dddMask: "(99) ",
            }}
            value={this.state.telefone}
            onChangeText={(text) => {
              this.setState({
                telefone: text,
              });
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.InputContainer,
            {
              transform: [{ translateY: this.state.offset.y }],
            },
          ]}
        >
          <TextInput
            style={styles.body}
            secureTextEntry={true}
            placeholder="Senha"
            onChangeText={(text) => this.setState({ senha: text })}
            value={this.state.senha}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </Animated.View>
        <View
          style={{
            width: "100%",
            shadowColor: "#444",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            justifyContent: "center",
            padding: 0,
            backgroundColor: backColor,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {this.state.errorMessage}
          </Text>
        </View>

        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => this.onPressLogin()}
        >
          Acessar
        </Button>

        {/*<Text style={styles.or}>OR</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => this.onPressFacebook()}
        >
          Login with Facebook
    </Button>*/}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  or: {
    fontFamily: AppStyles.fontName.main,
    color: "black",
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    marginTop: 30,
    fontSize: AppStyles.fontSize.title,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    fontSize: normalize(15),
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 40,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 0,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: "red",
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});

export default LoginScreen;
