import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import { AppStyles } from "../AppStyles";
import { RadioButton } from 'react-native-paper';
//import firebase from "react-native-firebase";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fullname: "",
      phone: "",
      email: "",
      password: "",
      checked: 'candidato',
    };
  }

  componentDidMount() {
    /*this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user
      });
    });
    */
  }

  componentWillUnmount() {
    //this.authSubscription();
  }

  onRegister = () => {
    const { email, password } = this.state;
    /*firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const { navigation } = this.props;
        const { fullname, phone, email } = this.state;
        const data = {
          email: email,
          fullname: fullname,
          phone: phone,
          appIdentifier: "rn-android-universal-listings"
        };
        user_uid = response.user._user.uid;
        firebase
          .firestore()
          .collection("users")
          .doc(user_uid)
          .set(data);
        firebase
          .firestore()
          .collection("users")
          .doc(user_uid)
          .get()
          .then(function(user) {
            navigation.dispatch({ type: "Login", user: user });
          })
          .catch(function(error) {
            const { code, message } = error;
            alert(message);
          });
      })
      .catch(error => {
        const { code, message } = error;
        alert(message);
      });
      */
  };

  render() {
    const { checked } = this.state;
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Contate nossos administradores 
        para ter acesso à plataforma</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Seu nome completo"
            onChangeText={text => this.setState({ fullname: text })}
            value={this.state.fullname}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.RadioContainer}>
          <RadioButton color="#3179CF"
            value="candidato"
            status={checked === 'candidato' ? 'checked' : 'unchecked'}
            onPress={() => { this.setState({ checked: 'candidato' }); }}
          /><Text>Sou candidato</Text>
          <RadioButton
            value="lider" color="#3179CF"
            status={checked === 'lider' ? 'checked' : 'unchecked'}
            onPress={() => { this.setState({ checked: 'lider' }); }}
          /><Text>Sou líder de campanha</Text>
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Seu telefone"
            onChangeText={text => this.setState({ phone: text })}
            value={this.state.phone}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Escolha uma senha"
            secureTextEntry={true}
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={[styles.facebookContainer, { marginTop: 30 }]}
          style={styles.facebookText}
          onPress={() => this.onRegister()}
        >
          Enviar
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  title: {
    fontSize: AppStyles.fontSize.normal,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 20
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    color: AppStyles.color.white
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: "red"
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main
  },
  RadioContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
    flexDirection: "row"
  },
  radioText: {
    fontSize: AppStyles.fontSize.title
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  facebookText: {
    color: AppStyles.color.white
  }
});

export default SignupScreen;
