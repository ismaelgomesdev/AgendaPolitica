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
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import Dialog, {
  ScaleAnimation,
  DialogFooter,
  DialogButton,
  DialogContent,
} from "react-native-popup-dialog";

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

      nome_eleitor: "",
      telefone_eleitor: "",
      endereco_eleitor: "",
      num_eleitor: "",
      bairro_eleitor: "",
      id_local: null,
      secao: "",

      valida_endereco: true,
      valida_local: true,
      valida_secao: true,
      valida_cpf: true,

      loading: false,
      data: [],
      locais: [],
      bairros: [],
      distritos: [],
      error: null,
      disabled: true,
      checked: "bairro",
      connected: true,
      dadosOffline: [],
      aviso: "indefinido",

      mensagem: "",
    };
    this.unsubscribe = null;
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  /*async componentWillMount() {
    this.state.token = await AsyncStorage.getItem('@PoliNet_token'); 
    console.log(this.state.token)
  }*/

  validaCampos = async () => {
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
      const { idLog } = this.state;
      try {
        const response = await api.post("/V_Lider.php", {
          tipo: "4",
          idLog,
        });
        if (response.data != null) {
          const {
            cpf_eleitor,
            local_eleitor,
            endereco_eleitor,
            secao_eleitor,
          } = response.data;
          this.setState({
            valida_cpf: cpf_eleitor,
            valida_local: local_eleitor,
            valida_endereco: endereco_eleitor,
            valida_secao: secao_eleitor,
            mensagem: JSON.stringify(response.data),
          });
        } else {
          this.setState({
            mensagem: "deu ruim",
          });
        }
      } catch (e) {
        this.setState({
          mensagem: e,
        });
      }
    } catch (e) {
      this.setState({
        mensagem: e,
      });
    }
  };

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

  nomeCandidato = () => {
    return nomeLogado;
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
  sincronizaDados = async () => {
    aux = [];
    const {
      nome_eleitor,
      telefone_eleitor,
      endereco_eleitor,
      num_eleitor,
      id_local,
      secao,
      connected,
    } = this.state;
    this.setState({
      dadosOffline: await AsyncStorage.getItem("@PoliNet_dadosOffline"),
    });
    let dadosOffline = JSON.parse(this.state.dadosOffline);
    await AsyncStorage.setItem("@PoliNet_dadosOffline", JSON.stringify(aux));
    if (dadosOffline != []) {
      dadosOffline.map(async (item) => {
        try {
          const response = await api.post("/V_Eleitor.php", {
            tipo: item.tipo,
            nome_eleitor: item.nome_eleitor,
            telefone_eleitor: item.telefone_eleitor,
            endereco_eleitor: item.endereco_eleitor,
            num_eleitor: item.num_eleitor,
            id_local: item.id_local,
            secao: item.secao,
            idLogado: item.idLogado,
          });
          if (response.data != null) {
            console.log(response.data);
            this.setState({
              nome_eleitor: "",
              telefone_eleitor: "",
              endereco_eleitor: "",
              num_eleitor: "",
              id_local: "",
              secao: "",
              disabled: true,
            });
            this.makeRemoteRequest2();
          } else {
            this.setState({
              errorMessage: "Dados incorretos. Tente novamente.",
            });
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  };
  cadastrarEleitor = async () => {
    /*if (
      nome_eleitor.length <= 0 ||
      telefone_eleitor.length <= 0 ||
      secao.length <= 0 ||
      endereco_eleitor.length <= 0 ||
      id_local.length <= 0 ||
      num_eleitor.length <= 0
    ) {
      this.setState({ errorMessage: "Por favor, preencha todos os dados." });
    } else {*/
    const {
      nome_eleitor,
      telefone_eleitor,
      endereco_eleitor,
      num_eleitor,
      id_local,
      secao,
      connected,
    } = this.state;
    if (connected) {
      try {
        const response = await api.post("/V_Eleitor.php", {
          tipo: "1",
          nome_eleitor,
          telefone_eleitor,
          endereco_eleitor,
          num_eleitor,
          id_local,
          secao,
          idLogado,
        });
        if (response.data != null) {
          console.log(response.data);
          this.setState({
            nome_eleitor: "",
            telefone_eleitor: "",
            endereco_eleitor: "",
            num_eleitor: "",
            id_local: "",
            secao: "",
            disabled: true,
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
          this.makeRemoteRequest2();
        } else {
          this.setState({
            errorMessage: "Dados incorretos. Tente novamente.",
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      let auxx = false;
      aux.map((item) => {
        if (
          nome_eleitor == item.nome_eleitor &&
          telefone_eleitor == item.telefone_eleitor &&
          endereco_eleitor == item.endereco_eleitor &&
          num_eleitor == item.num_eleitor &&
          id_local == item.id_local &&
          secao == item.secao
        ) {
          auxx = true;
        }
      });
      if (auxx) {
      } else {
        aux.push({
          tipo: "1",
          nome_eleitor: nome_eleitor,
          telefone_eleitor: telefone_eleitor,
          endereco_eleitor: endereco_eleitor,
          num_eleitor: num_eleitor,
          id_local: id_local,
          secao: secao,
          idLogado: idLogado,
        });

        console.log(aux);
        await AsyncStorage.setItem(
          "@PoliNet_dadosOffline",
          JSON.stringify(aux)
        );
      }
      this.setState({
        nome_eleitor: "",
        telefone_eleitor: "",
        endereco_eleitor: "",
        num_eleitor: "",
        id_local: "",
        secao: "",
        disabled: true,
      });
    }
  };
  /*state = {
    appState: AppState.currentState,
  };*/

  componentDidMount() {
    this.retornaBairros();

    this.getConnect();
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable) {
        this.setState({ connected: true, aviso: "online" });
      } else {
        this.setState({ connected: false, aviso: "offline" });
      }
    });
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  componentWillMount() {
    this.validaCampos();
    this.makeRemoteRequest();
    this.makeRemoteRequest2();
  }

  handleConnectivityChange = (state) => {
    if (state.isInternetReachable) {
      this.setState({ connected: true, aviso: "online" });
      this.sincronizaDados();
    } else {
      this.setState({ connected: false, aviso: "offline" });
    }
    console.log(state.isConnected ? "connected" : "not connected");
  };

  async getConnect() {
    console.log(Platform.OS);
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected == true) {
        this.setState({ connected: true, aviso: "online" });
      } else {
        this.setState({ connected: false, aviso: "offline" });
      }
    });

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );
  }

  /*_handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      this.setState({ connected: true, aviso: "online" });
      this.sincronizaDados();
    } else {
      this.setState({ connected: false, aviso: "offline" });
    }
  };*/

  componentDidUpdate() {
    console.log("component did update :", this.state); // one step behind child state
  }

  /*verificaCampos1() {
    const { nome_lider, telefone_lider, senha_lider, conf_senha } = this.state;
    if (nome_lider.length <= 0 || telefone_lider.length <= 0 || senha_lider.length <= 0 || conf_senha.length <= 0) {
      this.setState({errorMessage: "Por favor, preencha todos os dados."});
    } else if(senha_lider != conf_senha){
      this.setState({errorMessage: "A confirmação deve ser igual à senha!"});
    }
  }*/
  verificaCampos2() {
    const {
      nome_eleitor,
      telefone_eleitor,
      endereco_eleitor,
      num_eleitor,
      id_local,
      secao,
    } = this.state;
    console.log(
      nome_eleitor.length +
        " " +
        telefone_eleitor.length +
        " " +
        secao.length +
        " " +
        endereco_eleitor.length +
        " " +
        num_eleitor.length +
        " "
    );
    if (
      nome_eleitor.length <= 0 ||
      telefone_eleitor.length <= 0 ||
      secao.length <= 0 ||
      endereco_eleitor.length <= 0 ||
      id_local == null ||
      num_eleitor.length <= 0
    ) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  }
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

  makeRemoteRequest2 = async () => {
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
      try {
        const response = await api.post("/V_Eleitor.php", {
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
           : false,
          data: users
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });*/
  };
  retornaBairros = async () => {
    try {
      const response = await api.post("/V_Lider.php", {
        tipo: "3",
      });
      if (response.data != null) {
        console.log(response.data);
        const dados = response.data.dados;
        const bairros = dados.filter((dado) => dado.distrito === "0");
        const distritos = dados.filter((dado) => dado.distrito === "1");
        this.setState({
          locais: dados,
          bairros: bairros,
          distritos: distritos,
          loading: false,
        });
        console.log(this.state.bairros);
      } else {
        console.log("nullll");
      }
    } catch (e) {
      console.log("deu erro: " + e);
    }
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

  renderCpf = () => {};
  renderLocal2() {
    const bairros = this.state.bairros;
    const distritos = this.state.distritos;
    const { checked } = this.state;
    if (this.state.valida_local) {
      return (
        <View style={styles.InputContainer}>
          <this.renderPicker
            checked={checked}
            bairros={bairros}
            distritos={distritos}
            mudaLocal={this.mudaLocal}
          ></this.renderPicker>
        </View>
      );
    } else {
      return null;
    }
  }
  renderLocal() {
    const bairros = this.state.bairros;
    const distritos = this.state.distritos;
    const { checked } = this.state;
    if (this.state.valida_local) {
      return (
        <View style={styles.RadioContainer}>
          <RadioButton
            color="#3179CF"
            value="bairro"
            status={checked === "bairro" ? "checked" : "unchecked"}
            onPress={() => {
              this.setState({ checked: "bairro" });
            }}
          />
          <Text style={styles.labelRadio}>Bairro</Text>
          <RadioButton
            value="distrito"
            color="#3179CF"
            status={checked === "distrito" ? "checked" : "unchecked"}
            onPress={() => {
              this.setState({ checked: "distrito" });
            }}
          />
          <Text style={styles.labelRadio}>Distrito</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderNumero() {
    if (this.state.valida_endereco) {
      return (
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Número da residência"
            onChangeText={(text) => {
              this.setState({ num_eleitor: text });
              this.verificaCampos2();
            }}
            keyboardType="numeric"
            value={this.state.num_eleitor}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    } else {
      return null;
    }
  }
  renderEndereco() {
    if (this.state.valida_endereco) {
      return (
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Endereço"
            onChangeText={(text) => {
              this.setState({ endereco_eleitor: text });
              this.verificaCampos2();
            }}
            value={this.state.endereco_eleitor}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    } else {
      return null;
    }
  }
  renderSecao(){
    if (this.state.valida_secao) {
      return (
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Seção de votação"
            onChangeText={(text) => {
              this.setState({ secao: text });
              this.verificaCampos2();
            }}
            keyboardType="numeric"
            value={this.state.secao}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    } else {
      return null;
    }
  };
  renderRow({ item }) {
    return <ListItem title={item.nome_lider} subtitle={item.telefone_lider} />;
  }

  renderRow2({ item }) {
    return (
      <ListItem title={item.nome_eleitor} subtitle={item.telefone_eleitor} />
    );
  }
  mudaLocal = (local) => {
    this.setState({ id_local: local }); // receives date and updates state
  };
  renderPicker(props) {
    const [selectedValue, setSelectedValue] = React.useState(
      props.selectedValue
    );
    const { mudaLocal } = props;

    useEffect(() => {
      mudaLocal(selectedValue);
    }, [selectedValue, mudaLocal]);

    const change = (local) => {
      setSelectedValue(local);
    };
    if (props.checked == "bairro") {
      return (
        <Picker selectedValue={selectedValue} onValueChange={change}>
          <Picker.Item
            label={"Selecione o bairro do apoiador"}
            value={null}
            key={null}
          />
          {props.bairros.map((item) => (
            <Picker.Item
              label={item.nome_local}
              value={item.id_local}
              key={item.id_local}
            />
          ))}
        </Picker>
      );
    } else {
      return (
        <Picker selectedValue={selectedValue} onValueChange={change}>
          <Picker.Item
            label={"Selecione o distrito do apoiador"}
            value={null}
            key={null}
          />
          {props.distritos.map((item) => (
            <Picker.Item
              label={item.nome_local}
              value={item.id_local}
              key={item.id_local}
            />
          ))}
        </Picker>
      );
    }
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
    const bairros = this.state.bairros;
    const distritos = this.state.distritos;
    const { checked } = this.state;
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
    if (tipoLogado == "candidato") {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.containerForm}>
            <Text style={styles.title}>
              Novo líder de campanha
              {/*{this.props.user.email}*/}
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
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            />
          </View>
        </ScrollView>
      );
    } else {
      const { disabled } = this.state;
      const { locais } = this.state;
      const { id_local } = this.state;

      const local = locais.filter((dado) => dado.id_local === id_local);

      console.log(local);
      return (
        <ScrollView style={styles.container}>
          <Dialog
            visible={this.state.visible}
            dialogAnimation={new ScaleAnimation({})}
            width={0.8}
            footer={
              <DialogFooter>
                <DialogButton
                  text="Não"
                  onPress={() => {
                    this.setState({ visible: false });
                  }}
                />
                <DialogButton
                  text="Sim"
                  onPress={() => {
                    this.cadastrarEleitor();
                    this.setState({ visible: false });
                  }}
                />
              </DialogFooter>
            }
          >
            <DialogContent>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Nome: </Text>
                <Text style={{ fontSize: 15 }}>{this.state.nome_eleitor}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Telefone:{" "}
                </Text>
                <Text style={{ fontSize: 15 }}>
                  {this.state.telefone_eleitor}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Endereço:{" "}
                </Text>
                <Text style={{ fontSize: 15 }}>
                  {this.state.endereco_eleitor}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Número da residência:{" "}
                </Text>
                <Text style={{ fontSize: 15 }}>{this.state.num_eleitor}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Bairro/Distrito:{" "}
                </Text>
                <Text style={{ fontSize: 15 }}>
                  {local.map((item) => item.nome_local)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Seção de votação:{" "}
                </Text>
                <Text style={{ fontSize: 15 }}>{this.state.secao}</Text>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Tudo certo?
              </Text>
            </DialogContent>
          </Dialog>
          <View style={styles.containerForm}>
            <Text>
              Status de Rede: {this.state.aviso}
              {
                //<this.netState mudaState={this.mudaState}></this.netState>
              }
            </Text>
<Text>
              {
                //this.state.mensagem
              }
            </Text>
            <Text style={styles.title}>Novo apoiador</Text>
            
            {/*{this.props.user.email}*/}

            <Text>{this.state.errorMessage}</Text>
            <View style={styles.InputContainer}>
              <TextInput
                style={styles.body}
                placeholder="Nome completo"
                onChangeText={(text) => {
                  this.setState({ nome_eleitor: text });
                  this.verificaCampos2();
                }}
                value={this.state.nome_eleitor}
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.InputContainer}>
              {/*<TextInput
                style={styles.body}
                placeholder="Telefone"
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
                value={this.state.telefone_eleitor}
                onChangeText={(text) => {
                  this.setState({
                    telefone_eleitor: text,
                  });
                  this.verificaCampos2();
                }}
              />*/}
              <TextInput
                style={styles.body}
                placeholder="Telefone"
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
                value={this.state.telefone_eleitor}
                onChangeText={(text) => {
                  this.setState({
                    telefone_eleitor: text,
                  });
                  this.verificaCampos2();
                }}
              />
              {/*<TextInputMask
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
                value={this.state.telefone_eleitor}
                onChangeText={(text) => {
                  this.setState({
                    telefone_eleitor: text,
                  });
                  this.verificaCampos2();
                }}
              />*/}
            </View>
            {this.renderLocal()}
            {this.renderLocal2()}
            {this.renderEndereco()}
            {this.renderNumero()}
            {this.renderSecao()}
            <Button
              containerStyle={[styles.facebookContainer]}
              style={styles.facebookText}
              disabled={disabled}
              disabledContainerStyle={{ backgroundColor: "#547397" }}
              styleDisabled={{ color: "white" }}
              onPress={() =>
                //this.cadastrarEleitor()
                {
                  this.setState({ visible: true });
                }
              }
            >
              Cadastrar
            </Button>
          </View>
          <View
            containerStyle={{
              flex: 1,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            <Text style={styles.title}>
              Eleitores cadastrados por você
              {/*{this.props.user.email}*/}
            </Text>
            <Text>
              {aux.map(
                (item) => item.nome_eleitor + " (aguardando sincronização)\n"
              )}
            </Text>
            <FlatList
              data={this.state.data}
              renderItem={this.renderRow2}
              keyExtractor={(item) => item.id_eleitor}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
            />
          </View>
        </ScrollView>
      );
    }
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
