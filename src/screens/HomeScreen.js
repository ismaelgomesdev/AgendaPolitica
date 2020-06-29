import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Picker,
  SafeAreaView,
  SectionList,
  FlatList,
  ActivityIndicator,
  AppState,
  Platform,
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import Button from "react-native-button";
import { connect } from "react-redux";
import { AppIcon, AppStyles } from "../AppStyles";
import api from "../services/api";
import { TextInputMask } from "react-native-masked-text";
import { Configuration } from "../Configuration";
import { Dimensions, AsyncStorage } from "react-native";
import Constants from "expo-constants";
import { RadioButton } from "react-native-paper";
const width = Dimensions.get("window").width;
let idLogado = "";
let nomeLogado = "";
let tipoLogado = "";
let aux = [];
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "teste",
      idLog: "",
      nomeLog: "",
      tipoLog: "",
      nome_lider: "",
      telefone_lider: "",
      senha_lider: "",
      errorMessage: "",
      
      
      loading: false,
      data: [],
      
      error: null,
      disabled: true,


      aviso: "indefinido",
      mensagem: "",
    };
  }
  /*async componentWillMount() {
    this.state.token = await AsyncStorage.getItem('@PoliNet_token'); 
    console.log(this.state.token)
  }*/
  
  pesqDados = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");
    const { token } = this.state;
    try {
      const response = await api.post("/V_User.php", {
        tipo: "3",
        token,
      });
      console.log(response.data);
      const { nome, id, tipo } = response.data;
      nomeLogado = nome;
      idLogado = id;
      tipoLogado = tipo;
      this.setState({ idLog: id });
      this.setState({ nomeLog: nome });
      this.setState({ tipoLog: tipo });
      console.log(idLogado + ", " + nomeLogado + ", " + tipoLogado);
    } catch (e) {
      console.log(e);
    }
  };

  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => {
      return (
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          {navigation.state.params && navigation.state.params.menuIcon ? (
            <Image
              style={styles.userPhoto}
              source={{ uri: navigation.state.params.menuIcon }}
            />
          ) : (
            <Image
              style={styles.userPhoto}
              source={AppIcon.images.defaultUser}
            />
          )}
          <Text style={[styles.titleHeader, styles.leftTitle]}>
            Nome do Candidato
          </Text>
        </TouchableOpacity>
      );
    },
  });
  cadastrarLider = async () => {
    const { nome_lider, telefone_lider, senha_lider, conf_senha } = this.state;
    if (
      nome_lider.length <= 0 ||
      telefone_lider.length <= 0 ||
      senha_lider.length <= 0 ||
      conf_senha.length <= 0
    ) {
      this.setState({ errorMessage: "Por favor, preencha todos os dados." });
    } else if (senha_lider != conf_senha) {
      this.setState({ errorMessage: "A confirmação deve ser igual à senha!" });
    } else {
      try {
        const response = await api.post("/V_Lider.php", {
          tipo: "1",
          nome_lider,
          telefone_lider,
          senha_lider,
          idLogado,
        });
        if (response.data != null) {
          console.log(response.data);
          this.setState({
            nome_lider: "",
            telefone_lider: "",
            senha_lider: "",
            conf_senha: "",
            errorMessage: ""
          });
          /*const { 
            token, 
          } = response.data;
          //console.log(qrkey)
          await AsyncStorage.setItem('@PoliNet_token', token)
          //console.log(AsyncStorage.getItem('@InvestSe_token'))
          //this.props.navigation.navigate("AppNavigator", {keyRef: qrkey});
          const { navigation } = this.props;
          navigation.dispatch({ type: "Login", user: null });
          */
          this.makeRemoteRequest();
        } else {
          this.setState({ errorMessage: "Dados incorretos. Tente novamente." });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };


  /*state = {
    appState: AppState.currentState,
  };*/
  componentDidMount() {


    this.makeRemoteRequest();

    
  }
  componentWillMount() {


  }
 
  /*_handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connected: true, aviso: "online" });
      this.sincronizaDados();
    } else {
      this.setState({ connected: false, aviso: "offline" });
    }
  };*/

  /*verificaCampos1() {
    const { nome_lider, telefone_lider, senha_lider, conf_senha } = this.state;
    if (nome_lider.length <= 0 || telefone_lider.length <= 0 || senha_lider.length <= 0 || conf_senha.length <= 0) {
      this.setState({errorMessage: "Por favor, preencha todos os dados."});
    } else if(senha_lider != conf_senha){
      this.setState({errorMessage: "A confirmação deve ser igual à senha!"});
    }
  }*/

  makeRemoteRequest = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");
    const { token } = this.state;
    try {
      const response = await api.post("/V_User.php", {
        tipo: "3",
        token,
      });
      console.log(response.data);
      const { nome, id, tipo } = response.data;
      nomeLogado = nome;
      idLogado = id;
      tipoLogado = tipo;
      this.setState({ idLog: id });
      this.setState({ nomeLog: nome });
      this.setState({ tipoLog: tipo });
      console.log(idLogado + ", " + nomeLogado + ", " + tipoLogado);
      const { idLog } = this.state;
      console.log(idLog);
      try {
        const response = await api.post("/V_Lider.php", {
          tipo: "2",
          idL: idLog,
        });
        if (response.data != null) {
          let dados = response.data.data;
          console.log("dados: " + dados);
          response.data.data = dados;
          this.setState({ data: response.data.data, loading: false });
          console.log(this.state.data);
        } else {
          console.log("nullll");
        }
      } catch (e) {
        console.log("deu erro: " + e);
      }
    } catch (e) {
      console.log(e);
    }
    /*getUsers()
      .then(users => {
        this.setState({
          loading: false,
          data: users
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });*/
  };
  
  
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };
  renderHeader = () => {
    return (
      <View>
        {
          //<Text style={styles.title}>Meus líderes de campanha</Text>
        }
        <SearchBar placeholder="Pesquise aqui..." lightTheme round />
      </View>
    );
  };
  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };



  renderRow({ item }) {
    return <ListItem title={item.nome_lider} subtitle={item.telefone_lider} />;
  }


 
  /*mudaState = (conn) => {
    this.setState({ connected: conn });
  };
  ficaOn() {
    this.setState({ connected: true });
  }
  netState(props) {
    const netInfo = useNetInfo();
    let aviso = "indefinido";
    const { mudaState } = props;
    const [selectedValue, setSelectedValue] = React.useState(
      netInfo.isConnected
    );
    useEffect(() => {
      mudaState(selectedValue);
    }, [selectedValue, mudaState]);
    if (netInfo.isConnected) {
      aviso = "online";
    } else {
      aviso = "offline";
    }
    return <Text>{aviso}</Text>;
  }*/
  render() {

    /*const DATA = [
      {
        title: "Main dishes",
        data: ["Pizza", "Burger", "Risotto"]
      },
      {
        title: "Sides",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
      },
      {
        title: "Drinks",
        data: ["Water", "Coke", "Beer"]
      },
      {
        title: "Desserts",
        data: ["Cheese Cake", "Ice Cream"]
      }
    ];
    
    const Item = ({ title }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
*/

    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerForm}>
          <Text style={styles.title}>
            Novo líder de campanha
            {/*{this.state.mensagem}*/}
          </Text>
          <Text>{this.state.errorMessage}</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Nome completo"
              onChangeText={(text) => this.setState({ nome_lider: text })}
              value={this.state.nome_lider}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
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
              value={this.state.telefone_lider}
              onChangeText={(text) => {
                this.setState({
                  telefone_lider: text,
                });
              }}
            />
          </View>
          {/*<View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="E-mail"
              onChangeText={text => this.setState({ email: text })}
              value={this.state.email}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>*/}
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Senha de acesso"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ senha_lider: text })}
              value={this.state.senha_lider}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Confirme a senha"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ conf_senha: text })}
              value={this.state.conf_senha}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <Button
            containerStyle={[styles.facebookContainer]}
            style={styles.facebookText}
            onPress={() => this.cadastrarLider()}
          >
            Cadastrar
          </Button>
        </View>
        {/*
        <SafeAreaView style={styles.containerList}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
            </SafeAreaView>*/}
        <View
          containerStyle={{
            flex: 1,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
        >
          <Text style={styles.title}>
            Líderes cadastrados
            {/*{this.props.user.email}*/}
          </Text>
          <FlatList
            data={this.state.data}
            renderItem={this.renderRow}
            keyExtractor={(item) => item.id_lider}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
          />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: Configuration.home.listing_item.offset,
  },
  containerForm: {
    flex: 1,
    alignItems: "center",
  },
  titleHeader: {
    fontFamily: AppStyles.fontName.bold,
    color: AppStyles.color.tint,
    fontSize: 19,
    marginTop: 10,
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 5,
  },
  title: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold",
    textAlign: "center",
    color: AppStyles.color.title,
    fontSize: 25,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
  container1: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: AppStyles.fontSize.normal,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 20,
  },
  content: {
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
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
    marginBottom: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  RadioContainer: {
    width: AppStyles.textInputWidth.main,
    marginBottom: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
    flexDirection: "row",
  },
  labelRadio: {
    justifyContent: "center",
    paddingTop: 10,
  },
  radioText: {
    fontSize: AppStyles.fontSize.title,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  containerList: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
});
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
export default connect(mapStateToProps)(HomeScreen);
