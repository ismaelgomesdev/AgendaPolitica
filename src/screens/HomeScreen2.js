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
  Dimensions,
  AsyncStorage,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { List, ListItem, SearchBar } from "react-native-elements";
import Button from "react-native-button";
import { connect } from "react-redux";
import { AppIcon, AppStyles } from "../AppStyles";
import api from "../services/api";
import { TextInputMask } from "react-native-masked-text";
import { Configuration } from "../Configuration";

import Constants from "expo-constants";
import { normalize } from "./StatsScreen";
import { RadioButton } from "react-native-paper";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay";
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
let arrayholder = [];
class HomeScreen2 extends React.Component {
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
      msg: "",

      id_eleitor: "",
      nome_eleitor: "",
      telefone_eleitor: "",
      cpf_eleitor: "",
      endereco_eleitor: "",
      num_eleitor: "",
      bairro_eleitor: "",
      id_local: null,
      secao: "",
      desc_demanda: "",
      deps: [],

      valida_endereco: false,
      valida_local: false,
      valida_secao: false,
      valida_cpf: false,

      loading: true,
      data: [],
      locais: [],
      bairros: [],
      distritos: [],
      campos: [],
      error: null,
      disabled: true,
      checked: "bairro",
      connected: false,
      dadosOffline: [],
      aviso: "indefinido",
      visible: false,
      visible1: false,
      mensagem: "",
    };
    this.unsubscribe = null;
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }

  validaCampos = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");

    const { token } = this.state;
    if (this.state.connected == true) {
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
              //mensagem: JSON.stringify(response.data),
            });
            await AsyncStorage.setItem(
              "@PoliNet_cpf_eleitor",
              JSON.stringify(this.state.valida_cpf)
            );
            await AsyncStorage.setItem(
              "@PoliNet_local_eleitor",
              JSON.stringify(this.state.valida_local)
            );
            await AsyncStorage.setItem(
              "@PoliNet_endereco_eleitor",
              JSON.stringify(this.state.valida_endereco)
            );
            await AsyncStorage.setItem(
              "@PoliNet_secao_eleitor",
              JSON.stringify(secao_eleitor)
            );
          } else {
            this.setState({
              //mensagem: "deu ruim",
            });
          }
        } catch (e) {
          this.setState({
            //mensagem: e,
          });
        }
      } catch (e) {
        this.setState({
          //mensagem: e,
        });
      }
    }
  };

  personalCampos = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");

    const { token } = this.state;
    if (this.state.connected == true) {
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
            tipo: "5",
            idLog,
          });
          if (response.data != null) {
            let campos = response.data;
            this.setState({
              campos: campos,
              //mensagem: JSON.stringify(campos),
            });
            await AsyncStorage.setItem(
              "@PoliNet_campos",
              JSON.stringify(this.state.campos)
            );
          } else {
            this.setState({
              //mensagem: "",
            });
          }
        } catch (e) {
          this.setState({
            //mensagem: e,
          });
        }
      } catch (e) {
        this.setState({
          //mensagem: e,
        });
      }
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
      cpf_eleitor,
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

    let cont = 0;
    if (dadosOffline != []) {
      this.setState({
        //mensagem: dadosOffline.length
      });
      dadosOffline.map(async (item) => {
        cont = cont + 1;
        try {
          const response = await api.post("/V_Eleitor.php", {
            tipo: item.tipo,
            nome_eleitor: item.nome_eleitor,
            telefone_eleitor: item.telefone_eleitor,
            cpf_eleitor: item.cpf_eleitor,
            endereco_eleitor: item.endereco_eleitor,
            num_eleitor: item.num_eleitor,
            id_local: item.id_local,
            desc_demanda: item.desc_demanda,
            secao: item.secao,
            idLogado: item.idLogado,
          });
          aux.push(JSON.stringify(response.data));
          aux = [];
          if (response.data != null) {
            console.log(response.data);
            this.setState({
              nome_eleitor: "",
              telefone_eleitor: "",
              cpf_eleitor: "",
              endereco_eleitor: "",
              num_eleitor: "",
              desc_demanda: "",
              secao: "",
              disabled: true,
            });
            const { id } = response.data;
            if (item.campos.length > 0) {
              item.campos.map(async (campo) => {
                id_campo = campo.id_campo;
                valor_campo = campo.valor_campo;
                try {
                  const response = await api.post("/V_Campos.php", {
                    tipo: "4",
                    id,
                    id_campo,
                    valor_campo,
                  });
                  campo.valor_campo = "";
                } catch (e) {
                  campo.valor_campo = "";
                }
              });
            }
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
    let {
      nome_eleitor,
      telefone_eleitor,
      cpf_eleitor,
      endereco_eleitor,
      num_eleitor,
      id_local,
      secao,
      desc_demanda,
      connected,
      campos,
    } = this.state;
    const {
      valida_cpf,
      valida_endereco,
      valida_local,
      valida_secao,
    } = this.state;

    if (campos.length > 0) _textInput.setNativeProps({ text: "" });
    if (connected) {
      try {
        const response = await api.post("/V_Eleitor.php", {
          tipo: "1",
          nome_eleitor,
          telefone_eleitor,
          cpf_eleitor,
          endereco_eleitor,
          num_eleitor,
          id_local,
          secao,
          desc_demanda,
          idLogado,
        });
        const falta = "Preencha todos os dados!";
        if (valida_cpf && cpf_eleitor == "") {
          this.setState({ msg: falta });
        }
        if (valida_endereco && endereco_eleitor == "") {
          this.setState({ msg: falta });
        }
        if (valida_local && id_local == "") {
          this.setState({ msg: falta });
        }
        if (valida_secao && secao == "") {
          this.setState({ msg: falta });
        }
        if (response.data != null) {
          if (
            response.data.mensagem != null &&
            response.data.mensagem == "Esse membro já foi cadastrado!"
          ) {
            const msg = response.data.mensagem;
            this.setState({ msg: msg });
          } else {
            console.log(response.data);
            this.setState({
              nome_eleitor: "",
              telefone_eleitor: "",
              cpf_eleitor: "",
              endereco_eleitor: "",
              num_eleitor: "",
              secao: "",
              desc_demanda: "",
              msg: "",
              disabled: true,
            });

            const { id } = response.data;
            if (campos.length > 0) {
              campos.map(async (campo) => {
                id_campo = campo.id_campo;
                valor_campo = campo.valor_campo;
                try {
                  const response = await api.post("/V_Campos.php", {
                    tipo: "4",
                    id,
                    id_campo,
                    valor_campo,
                  });
                  campo.valor_campo = "";
                } catch (e) {
                  campo.valor_campo = "";
                }
              });
            }
            let camp = campos;
            this.setState({
              campos: camp,
            });
            this.makeRemoteRequest2();
          }
        } else {
          this.setState({
            errorMessage: "Dados incorretos. Tente novamente.",
          });
        }
      } catch (err) {
        //alert(err);
      }
    } else {
      let auxx = false;
      aux.map((item) => {
        if (
          nome_eleitor == item.nome_eleitor &&
          telefone_eleitor == item.telefone_eleitor &&
          endereco_eleitor == item.endereco_eleitor &&
          cpf_eleitor == item.cpf_eleitor &&
          num_eleitor == item.num_eleitor &&
          id_local == item.id_local &&
          desc_demanda == desc_demanda &&
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
          cpf_eleitor: cpf_eleitor,
          endereco_eleitor: endereco_eleitor,
          num_eleitor: num_eleitor,
          id_local: id_local,
          secao: secao,
          desc_demanda: desc_demanda,
          campos: campos,
          idLogado: idLogado,
        });
        this.setState({
          mensagem: JSON.stringify(aux),
        });
        console.log(aux);
        await AsyncStorage.setItem(
          "@PoliNet_dadosOffline",
          JSON.stringify(aux)
        );
      }
      campos.map((campo) => {
        campo.valor_campo = "";
      });
      this.setState({
        nome_eleitor: "",
        telefone_eleitor: "",
        cpf_eleitor: "",
        endereco_eleitor: "",
        num_eleitor: "",
        secao: "",
        desc_demanda: "",
        campos: campos,
        disabled: true,
      });
    }
  };
  /*state = {
    appState: AppState.currentState,
  };*/
  componentWillMount() {
    /*await AsyncStorage.setItem("@PoliNet_locais", this.state.locais);
    await AsyncStorage.setItem("@PoliNet_bairros", this.state.bairros);
    await AsyncStorage.setItem("@PoliNet_distritos", this.state.distritos);
    await AsyncStorage.setItem("@PoliNet_cpf_eleitor", this.state.valida_cpf);
    await AsyncStorage.setItem("@PoliNet_local_eleitor", this.state.valida_local);
    await AsyncStorage.setItem("@PoliNet_endereco_eleitor", this.state.valida_endereco);
    await AsyncStorage.setItem("@PoliNet_secao_eleitor", this.state.valida_secao);
    await AsyncStorage.setItem("@PoliNet_campos", this.state.campos);
    await AsyncStorage.setItem("@PoliNet_data", this.state.data);*/

    const solta = async () => {
      try {
        const dados = await AsyncStorage.getItem("@PoliNet_locais");
        const bairros = await AsyncStorage.getItem("@PoliNet_bairros");
        const distritos = await AsyncStorage.getItem("@PoliNet_distritos");
        const cpf_eleitor = await AsyncStorage.getItem("@PoliNet_cpf_eleitor");
        const local_eleitor = await AsyncStorage.getItem(
          "@PoliNet_local_eleitor"
        );
        const endereco_eleitor = await AsyncStorage.getItem(
          "@PoliNet_endereco_eleitor"
        );
        const secao_eleitor = await AsyncStorage.getItem(
          "@PoliNet_secao_eleitor"
        );
        const campos = await AsyncStorage.getItem("@PoliNet_campos");
        const data = await AsyncStorage.getItem("@PoliNet_data");
        /*alert(
          "data:" +
            JSON.stringify(data) +
            "\n campos:" +
            JSON.stringify(campos) +
            "\n valida_cpf: " +
            JSON.stringify(cpf_eleitor) +
            "\n valida_local: " +
            JSON.stringify(local_eleitor) +
            "\n valida_endereco: " +
            JSON.stringify(endereco_eleitor) +
            "\n valida_secao: " +
            JSON.stringify(secao_eleitor) +
            "\n locais: " +
            JSON.stringify(dados) +
            "\n bairros: " +
            JSON.stringify(bairros) +
            "\n distritos: " +
            JSON.stringify(distritos)
        );*/

        this.setState({
          data: JSON.parse(data),
          loading: false,

          valida_cpf: JSON.parse(cpf_eleitor),
          valida_local: JSON.parse(local_eleitor),
          valida_endereco: JSON.parse(endereco_eleitor),
          valida_secao: JSON.parse(secao_eleitor),

          bairros: JSON.parse(bairros),
          distritos: JSON.parse(distritos),
        });
        if (campos != null) {
          this.setState({
            campos: JSON.parse(campos),
          });
        }
        if (dados != null) {
          this.setState({
            locais: JSON.parse(dados),
          });
        }
      } catch (e) {
        alert(e);
      }
    };
    solta();
    this.retornaBairros();
    this.validaCampos();
    this.personalCampos();
    this.makeRemoteRequest2();
    this.getConnect();
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

  
  componentDidMount() {
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
      valida_cpf,
      valida_endereco,
      valida_local,
      valida_secao,
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
    if (nome_eleitor.length <= 0 || telefone_eleitor.length <= 0) {
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
          this.setState({ data: response.data.data });
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
    if (this.state.connected == true) {
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
            await AsyncStorage.setItem(
              "@PoliNet_data",
              JSON.stringify(this.state.data)
            );
            arrayholder = dados;
            console.log(this.state.data);
          } else {
            this.setState({ loading: false });
          }
        } catch (e) {
          console.log("deu erro: " + e);
        }
      } catch (e) {
        console.log(e);
      }
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
  visualizarEleitor = async (id) => {
    try {
      const response = await api.post("/V_Eleitor.php", {
        tipo: "3",
        id,
      });
      if (response.data != null) {
        const {
          id,
          nome,
          telefone,
          cpf,
          endereco,
          num,
          id_local,
          id_secao,
        } = response.data;
        this.setState({
          id_eleitor: id,
          nome_eleitor: nome,
          telefone_eleitor: telefone,
          cpf_eleitor: cpf,
          endereco_eleitor: endereco,
          num_eleitor: num,
          id_local: id_local,
          secao: id_secao,
        });
      } else {
        console.log("nullll");
      }
    } catch (e) {
      console.log("deu erro: " + e);
    }
  };
  excluirEleitor = async (id) => {
    try {
      const response = await api.post("/V_Eleitor.php", {
        tipo: "4",
        id,
      });
      let campos = this.state.campos;
      campos.map((campo) => {
        campo.valor_campo = "";
      });
      this.setState({ campos: campos });
      this.setState({
        visible1: false,
        id_eleitor: "",
        nome_eleitor: "",
        telefone_eleitor: "",
        cpf_eleitor: "",
        endereco_eleitor: "",
        num_eleitor: "",
        secao: "",
        desc_demanda: "",
        campos: campos,
      });
      this.makeRemoteRequest2();
    } catch (e) {
      console.log("deu erro: " + e);
    }
  };
  retornaBairros = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");

    const { token } = this.state;
    if (this.state.connected == true) {
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
            tipo: "3",
            idLog,
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
            });
            await AsyncStorage.setItem(
              "@PoliNet_locais",
              JSON.stringify(dados)
            );
            await AsyncStorage.setItem(
              "@PoliNet_bairros",
              JSON.stringify(this.state.bairros)
            );
            await AsyncStorage.setItem(
              "@PoliNet_distritos",
              JSON.stringify(this.state.distritos)
            );
            console.log(this.state.bairros);
          } else {
            console.log("nullll");
            this.setState({});
          }
        } catch (e) {}
      } catch (e) {}
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
  searchFilterFunction = (text) => {
    const newData = arrayholder.filter((item) => {
      const itemData = `${item.nome_eleitor.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData });
  };
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Pesquise aqui..."
        lightTheme
        round
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
      />
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

  renderCpf() {
    if (this.state.valida_cpf) {
      return (
        <View style={styles.InputContainer}>
          <TextInputMask
            type={"cpf"}
            placeholder="CPF"
            style={styles.body}
            value={this.state.cpf_eleitor}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                cpf_eleitor: text,
              });
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  renderLocal2() {
    const bairros = this.state.bairros;
    const distritos = this.state.distritos;
    const { checked } = this.state;
    const { id_local } = this.state;
    if (this.state.valida_local) {
      return (
        <View style={styles.InputContainer}>
          <this.renderPicker
            checked={checked}
            bairros={bairros}
            distritos={distritos}
            selectedValue={id_local}
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
  renderDialogEndereco() {
    if (this.state.valida_endereco) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Endereço: </Text>
          <Text style={{ fontSize: 15 }}>{this.state.endereco_eleitor}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderDialogNumero() {
    if (this.state.valida_endereco) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Número da residência:{" "}
          </Text>
          <Text style={{ fontSize: 15 }}>{this.state.num_eleitor}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderDialogLocal() {
    const { id_local } = this.state;
    const { locais } = this.state;
    const local = locais.filter((dado) => dado.id_local === id_local);
    if (this.state.valida_local) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Bairro/Distrito:{" "}
          </Text>
          <Text style={{ fontSize: 15 }}>
            {local.map((item) => item.nome_local)}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderDialogSecao() {
    if (this.state.valida_secao) {
      return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Número do membro:{" "}
          </Text>
          <Text style={{ fontSize: 15 }}>{this.state.secao}</Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderSecao() {
    if (this.state.valida_secao) {
      return (
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Número do membro"
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
  }
  renderCampos() {
    if (this.state.campos.length > 0) {
      return (
        <View style={styles.InputContainer}>
          {this.state.campos.map((campo) => {
            return (
              <TextInput
                style={styles.body}
                placeholder={campo.nome_campo}
                onChangeText={(text) => {
                  campo.valor_campo = text;
                }}
                ref={(component) => (_textInput = component)}
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
              />
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  }
  renderRow({ item }) {
    return <ListItem title={item.nome_lider} subtitle={item.telefone_lider} />;
  }

  renderRow2 = ({ item }) => {
    if (this.state.connected) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({ visible1: true });
            this.visualizarEleitor(item.id_eleitor);
          }}
        >
          <ListItem
            title={item.nome_eleitor}
            subtitle={item.telefone_eleitor}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="wifi-off" color="gray" size={normalize(50)} />
        </View>
      );
    }
  };
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
          <Picker.Item label={"Selecione o bairro"} value={null} key={null} />
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
          <Picker.Item label={"Selecione o distrito"} value={null} key={null} />
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

  adicionaDep = () => {
    this.state.deps.push(
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
    );
  };
  hope = async () => {};
  render() {
    const bairros = this.state.bairros;
    const distritos = this.state.distritos;
    const { checked } = this.state;
    let color;
    let color2;
    let backColor;
    let backColor2;
    let text;
    let icon;

    if (this.state.connected) {
      color = "#000000";
      color2 = "transparent";
      backColor = "#FCCB0A";
      backColor2 = "transparent";
      text = "online.";
      icon = "wifi";
    } else {
      color = "#FCCB0A";
      color2 = "#FCCB0A";
      text = "offline.";
      icon = "wifi-off";
      backColor = "#000000";
      backColor2 = "#000000";
    }
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
    const { disabled } = this.state;
    const { locais } = this.state;
    const { id_local } = this.state;

    const local = locais.filter((dado) => dado.id_local === id_local);

    console.log(local);
    return (
      <ScrollView style={styles.container} ref="_scrollView">
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          //textContent={"Carregando..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
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
            {this.renderDialogEndereco()}
            {this.renderDialogNumero()}
            {this.renderDialogLocal()}
            {this.renderDialogSecao()}
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
        <Dialog
          visible={this.state.visible1}
          dialogAnimation={new ScaleAnimation({})}
          width={0.8}
          footer={
            <DialogFooter>
              <DialogButton
                text="Fechar"
                onPress={() => {
                  let campos = this.state.campos;
                  campos.map((campo) => {
                    campo.valor_campo = "";
                  });
                  this.setState({ campos: campos });
                  this.setState({
                    visible1: false,
                    id_eleitor: "",
                    nome_eleitor: "",
                    telefone_eleitor: "",
                    cpf_eleitor: "",
                    endereco_eleitor: "",
                    num_eleitor: "",
                    secao: "",
                    desc_demanda: "",
                    campos: campos,
                  });
                }}
              />
              <DialogButton
                text="Excluir"
                onPress={() => {
                  //this.refs._scrollView.scrollTo(0);
                  let id = this.state.id_eleitor;
                  this.excluirEleitor(id);
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
            {this.renderDialogEndereco()}
            {this.renderDialogNumero()}
            {this.renderDialogLocal()}
            {this.renderDialogSecao()}
          </DialogContent>
        </Dialog>

        <LinearGradient
          style={styles.headerNew}
          colors={["#2060AD", "#58C6CA"]}
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
        >
          <View style={styles.titleContainer}>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
            >
              <Image
                style={styles.logoutIcon}
                source={AppIcon.images.logout1}
              ></Image>
            </TouchableOpacity>

            <Text style={styles.titleNew}> Olá, {nomeLogado}! </Text>
          </View>
        </LinearGradient>
        <View style={styles.containerForm}>
          <View
            style={{
              width: "100%",
              backgroundColor: backColor,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              shadowColor: "#444",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              padding: 3,
            }}
          >
            <Icon name={icon} color={color} size={16} />
            <Text
              style={{
                paddingStart: 3,
                textAlign: "center",
                color: color,
                fontWeight: "bold",
              }}
            >
              Você está {text}
            </Text>
          </View>
          <Text style={styles.title}>Novo membro da equipe</Text>
          {/*{this.props.user.email}*/}
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
              value={this.state.telefone_eleitor}
              onChangeText={(text) => {
                this.setState({
                  telefone_eleitor: text,
                });
                this.verificaCampos2();
              }}
            />
          </View>
          {this.renderCpf()}
          {this.renderLocal()}
          {this.renderLocal2()}
          {this.renderEndereco()}
          {this.renderNumero()}
          {this.renderSecao()}
          {this.renderCampos()}
          <View style={styles.InputContainer1}>
            <TextInput
              style={styles.body}
              placeholder="Demanda"
              onChangeText={(text) => {
                this.setState({ desc_demanda: text });
                this.verificaCampos2();
              }}
              value={this.state.desc_demanda}
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={{ marginBottom: 15 }}>{this.state.msg}</Text>
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
          style={styles.containerForm1}
        >
          <Text style={styles.title}>
            Membros da equipe cadastrados por você
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: backColor2,
              shadowColor: "#444",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Text style={{ color: color2, textAlign: "center" }}>
              Aguardando conexão para salvar:
            </Text>
            {aux.map((item) => {
              return (
                <Text style={{ color: color2, textAlign: "center" }}>
                  {item.nome_eleitor}
                </Text>
              );
            })}
          </View>
          <FlatList
            style={{ width: "100%" }}
            data={this.state.data}
            renderItem={this.renderRow2}
            keyExtractor={(item) => item.id_eleitor}
            ListHeaderComponent={this.renderHeader}
            //ItemSeparatorComponent={this.renderSeparator}
            //ListFooterComponent={this.renderFooter}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  headerNew: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    flex: 1,
    height: 200,
    flexDirection: "row",
    justifyContent: "center",
  },
  containerForm: {
    margin: 30,
    marginTop: normalize(50),
    borderRadius: 10,
    shadowColor: "#444",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    paddingLeft: 0,
    padding: 0,
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  containerForm1: {
    margin: 30,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#444",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    paddingLeft: 0,
    paddingRight: 0,
    padding: 5,
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  logoutIcon: {
    tintColor: "#ffffff",
    marginLeft: 15,
    marginTop: normalize(80),
    paddingTop: normalize(15),
    maxWidth: 24,
    maxHeight: 24,
  },
  titleContainer: {
    backgroundColor: "transparent",
    width: "100%",
  },
  titleNew: {
    fontSize: normalize(15),
    marginBottom: normalize(150),
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -0.25, height: 0.25 },
    textShadowRadius: 10,
    color: "#ffffff",
    textAlign: "center",
  },

  spinnerTextStyle: {
    color: "#FFF",
  },
  header: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: AppStyles.color.background,
    flex: 1,
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
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
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
  InputContainer1: {
    width: AppStyles.textInputWidth.main,
    marginBottom: 8,
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
    marginBottom: -25,
    marginTop: -10,
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

export default connect(mapStateToProps)(HomeScreen2);
