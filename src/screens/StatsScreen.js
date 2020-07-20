import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  SectionList,
  FlatList,
  ActivityIndicator,
  Dimensions,
  AsyncStorage,
  Platform,
  PixelRatio,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { List, ListItem, SearchBar } from "react-native-elements";
import Button from "react-native-button";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { AppIcon, AppStyles } from "../AppStyles";
import api from "../services/api";
import Spinner from "react-native-loading-spinner-overlay";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import { TextInputMask } from "react-native-masked-text";
import { Configuration } from "../Configuration";
import Constants from "expo-constants";
import Dialog, {
  ScaleAnimation,
  DialogFooter,
  DialogButton,
  DialogContent,
} from "react-native-popup-dialog";

const width = Dimensions.get("window").width;
let arrayholder = [];
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

let idLogado = "";
let nomeLogado = "";
let tipoLogado = "";
let data2 = [];
let data3 = [];
const numColumns = 3;

class StatsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "teste",
      idLog: "",
      nomeLog: "",
      tipoLog: "",

      errorMessage: "",

      secao: false,
      cpf: false,
      endereco: false,
      local: false,

      loading: true,
      data: [],
      error: null,
      disabled: true,
      quantidade: null,
      quantidade_lider: [],
      quantidade_semana: null,
      quantidade_mes: null,
      quantidade_mes2: [],
      quantidade_local: [],
      quantidade_secao: [],
      membros: [],
      membros_mes: [],
      membros_semana: [],
      labels: [],
      datasets: [],

      visible: false,
      visible1: false,
      visible2: false,
    };
  }

  static navigationOptions = ({ navigation }) => ({});

  totalEleitores = async () => {
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
    const idC = this.state.idLog;
    try {
      const response = await api.post("/V_Candidato.php", {
        tipo: "3",
        idC,
      });
      console.log(response.data);
      const {
        quantidade,
        quantidade_lider,
        quantidade_semana,
        quantidade_mes,
        quantidade_mes2,
        quantidade_local,
        quantidade_secao,
        membros,
        membros_mes,
        membros_semana,
      } = response.data;
      arrayholder = membros;
      this.setState({
        quantidade: quantidade,
        quantidade_lider: quantidade_lider,
        quantidade_semana: quantidade_semana,
        quantidade_mes: quantidade_mes,
        quantidade_mes2: quantidade_mes2,
        quantidade_local: quantidade_local,
        quantidade_secao: quantidade_secao,
        membros: membros,
        membros_mes: membros_mes,
        membros_semana: membros_semana,
        loading: false,
      });
      console.log(quantidade_mes2);
      const quantidade_bairro = quantidade_local.filter(
        (item) => item.distrito === "0"
      );
      console.log(quantidade_bairro);
      const quantidade_distrito = quantidade_local.filter(
        (item) => item.distrito === "1"
      );
      let aux = [];
      console.log(quantidade_distrito);
      quantidade_bairro.map((item) => {
        (aux = {
          name: item.nome_local,
          population: parseInt(item.qtd),
          color: item.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }),
          data2.push(aux);
      });
      quantidade_distrito.map((item) => {
        (aux = {
          name: item.nome_local,
          population: parseInt(item.qtd),
          color: item.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }),
          data3.push(aux);
      });
      let aux2 = [];
      let aux3 = [];
      quantidade_mes2.map((item) => {
        aux2.push(item.mes);
        aux3.push(parseInt(item.qtd));
      });
      this.setState({
        labels: aux2,
        datasets: aux3,
      });
      console.log(this.state.labels);
      console.log(this.state.datasets);
    } catch (err) {
      alert(err);
    }
  };

  componentDidMount() {
    this.makeRemoteRequest();
    this.makeRemoteRequest2();
    this.totalEleitores();
  }

  componentWillMount() {
    this.verificaCampos();
  }

  verificaCampos = async () => {
    this.state.token = await AsyncStorage.getItem("@PoliNet_token");

    const { token } = this.state;

    try {
      const response = await api.post("/V_User.php", {
        tipo: "3",
        token,
      });

      const { nome, id, tipo } = response.data;
      nomeLogado = nome;
      idLogado = id;
      tipoLogado = tipo;

      this.setState({ idLog: id });
      this.setState({ nomeLog: nome });
      this.setState({ tipoLog: tipo });
      this.setState({ loading: true });
      const { idLog } = this.state;
    } catch (e) {}
    const { idLog } = this.state;
    try {
      const response = await api.post("/V_Candidato.php", {
        tipo: "5",
        idLog,
      });
      const { cpf, endereco, local, secao } = response.data;
      this.setState({
        cpf: cpf,
        endereco: endereco,
        local: local,
        secao: secao,
      });
    } catch (e) {}
  };

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
      this.setState({ loading: true });
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
      this.setState({ loading: true });
      const { idLog } = this.state;
      console.log(idLog);
      this.setState({ loading: true });
      try {
        const response = await api.post("/V_Eleitor.php", {
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

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item1, styles.itemInvisible]} />;
    }
    if (item.quantidade != null) {
      return (
        <TouchableOpacity
          style={styles.item1}
          onPress={() => {
            this.setState({ visible: true });
          }}
        >
          <Text style={styles.itemText1}>Total de membros da equipe:</Text>

          <Text style={styles.itemNumber1}>
            <Text style={styles.itemNumber1}>{item.quantidade}</Text>
          </Text>
        </TouchableOpacity>
      );
    } else if (item.quantidade_semana != null) {
      return (
        <TouchableOpacity
          style={styles.item1}
          onPress={() => {
            this.setState({ visible1: true });
          }}
        >
          <Text style={styles.itemText1}>Novos membros nesta semana:</Text>
          <Text style={styles.itemNumber1}>{item.quantidade_semana}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.item1}
          onPress={() => {
            this.setState({ visible2: true });
          }}
        >
          <Text style={styles.itemText1}>Novos membros neste mês:</Text>
          <Text style={styles.itemNumber1}>{item.quantidade_mes}</Text>
        </TouchableOpacity>
      );
    }
  };

  renderItem2 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item1, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item1}>
        <Text style={styles.itemText1}>{item.nome_lider}</Text>
        <Text style={styles.itemNumber1}>{item.quantidade_lider}</Text>
        <Text style={styles.itemText1}>membros</Text>
      </View>
    );
  };

  renderItem3 = ({ item, index }) => {
    if (item.empty === true) {
      return null;
    }
    return (
      <View style={styles.item1}>
        <Text style={styles.itemText1}>Número {item.secao}:</Text>
        <Text style={styles.itemNumber1}>{item.qtd}</Text>
        <Text style={styles.itemText1}>membros</Text>
      </View>
    );
  };

  renderSecoes = () => {
    if (this.state.secao) {
      const formatData = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);

        let numberOfElementsLastRow =
          data.length - numberOfFullRows * numColumns;
        while (
          numberOfElementsLastRow !== numColumns &&
          numberOfElementsLastRow !== 0
        ) {
          data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
          numberOfElementsLastRow++;
        }

        return data;
      };
      const { quantidade_secao } = this.state;
      return (
        <View style={{ width: "100%" }}>
          <Text style={styles.title}>Membros por número</Text>
          <FlatList
            data={formatData(quantidade_secao, numColumns)}
            style={styles.containerList}
            renderItem={this.renderItem3}
            numColumns={numColumns}
          />
        </View>
      );
    } else {
      return null;
    }
  };
  searchFilterFunction = (text) => {
    const newData = arrayholder.filter((item) => {
      const itemData = `${item.nome_eleitor.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ membros: newData });
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
  renderRow = ({ item }) => {
    return (
      <View style={{ textAlign: "center", alignItems: "center" }}>
        <Text style={{ fontSize: normalize(15) }}>{item.nome_eleitor}</Text>
        <Text style={{ fontSize: normalize(12) }}>{item.telefone_eleitor}</Text>
        <Text style={{ fontSize: normalize(12) }}>
          Cadastrado(a) por: {item.nome_lider}
        </Text>
        <Text style={{ fontSize: normalize(12) }}>
          Em: {item.data_cad_eleitor}
        </Text>
        <View
          style={{
            marginVertical: 8,
            borderColor: "black",
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
          }}
        />
      </View>
    );
  };
  render() {
    const data = [
      { quantidade: this.state.quantidade },
      { quantidade_semana: this.state.quantidade_semana },
      { quantidade_mes: this.state.quantidade_mes },

      // { key: 'K' },
      // { key: 'L' },
    ];
    const membros = this.state.membros;
    const membros_semana = this.state.membros_semana;
    const membros_mes = this.state.membros_mes;

    const porLider = this.state.quantidade_lider;

    const formatData = (data, numColumns) => {
      const numberOfFullRows = Math.floor(data.length / numColumns);

      let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
      while (
        numberOfElementsLastRow !== numColumns &&
        numberOfElementsLastRow !== 0
      ) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
      }

      return data;
    };
    const data2 = [];
    const data3 = [];
    const quantidade_bairro = this.state.quantidade_local.filter(
      (item) => item.distrito === "0"
    );
    console.log(quantidade_bairro);
    const quantidade_distrito = this.state.quantidade_local.filter(
      (item) => item.distrito === "1"
    );
    let aux = [];
    console.log(quantidade_distrito);
    quantidade_bairro.map((item) => {
      (aux = {
        name: item.nome_local,
        population: parseInt(item.qtd),
        color: item.color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }),
        data2.push(aux);
    });
    quantidade_distrito.map((item) => {
      (aux = {
        name: item.nome_local,
        population: parseInt(item.qtd),
        color: item.color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }),
        data3.push(aux);
    });
    return (
      <ScrollView style={styles.container}>
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
          width={0.9}
          dialogStyle={{ maxHeight: "90%" }}
        >
          <DialogContent>
            <Text style={styles.title}>Todos os membros</Text>
            <FlatList
              style={{ width: "100%", height: "85%" }}
              data={membros}
              renderItem={this.renderRow}
              keyExtractor={(item) => item.id_eleitor}
              ListHeaderComponent={this.renderHeader}
            />
            <View style={{ height: "15%" }}>
              <DialogButton
                text="Fechar"
                onPress={() => {
                  this.setState({
                    visible: false,
                    id_lider: "",
                    nome_lider: "",
                    telefone_lider: "",
                    acesso: "",
                    cadastro: "",
                  });
                }}
              />
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          visible={this.state.visible1}
          dialogAnimation={new ScaleAnimation({})}
          width={0.9}
          dialogStyle={{ maxHeight: "90%" }}
        >
          <DialogContent>
          <Text style={styles.title}>Novos nesta semana</Text>
            <FlatList
              style={{ minWidth: "100%", height: "85%" }}
              data={membros_semana}
              renderItem={this.renderRow}
              keyExtractor={(item) => item.id_eleitor}
              ListHeaderComponent={this.renderHeader}
            />
            <View style={{ height: "15%" }}>
              <DialogButton
                text="Fechar"
                
                onPress={() => {
                  this.setState({
                    visible1: false,
                    id_lider: "",
                    nome_lider: "",
                    telefone_lider: "",
                    acesso: "",
                    cadastro: "",
                  });
                }}
              />
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          visible={this.state.visible2}
          dialogAnimation={new ScaleAnimation({})}
          width={0.9}
          dialogStyle={{ maxHeight: "90%" }}
        >
          <DialogContent>
          <Text style={styles.title}>Novos neste mês</Text>
            <FlatList
              style={{ minWidth: "100%", height: "85%" }}
              data={membros_mes}
              renderItem={this.renderRow}
              keyExtractor={(item) => item.id_eleitor}
              ListHeaderComponent={this.renderHeader}
            />
            <View style={{ height: "15%" }}>
              <DialogButton
                text="Fechar"
                onPress={() => {
                  this.setState({
                    visible2: false,
                    id_lider: "",
                    nome_lider: "",
                    telefone_lider: "",
                    acesso: "",
                    cadastro: "",
                  });
                }}
              />
            </View>
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

            <Text style={styles.titleNew}> Relatórios </Text>
          </View>
        </LinearGradient>
        <View style={styles.containerForm}>
          <FlatList
            data={formatData(data, numColumns)}
            style={styles.containerList}
            renderItem={this.renderItem}
            numColumns={numColumns}
          />
          {
            // eslint-disable-next-line react/destructuring-assignment
            this.state.labels.length > 0 && (
              <View>
                <Text style={styles.title}>Evolução mensal</Text>
                <LineChart
                  data={{
                    labels: this.state.labels,
                    datasets: [
                      {
                        data: this.state.datasets,
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width} // from react-native
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#000000",
                    backgroundGradientFrom: "#000000",
                    backgroundGradientTo: "#000000",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#FCCB0A",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            )
          }
          <Text style={styles.title}>Desempenho dos líderes</Text>
          <FlatList
            data={formatData(porLider, numColumns)}
            style={styles.containerList}
            renderItem={this.renderItem2}
            numColumns={numColumns}
          />
          <Text style={styles.title}>Membros por bairro</Text>
          <PieChart
            data={data2}
            width={width}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={styles.title}>Membros por distrito</Text>
          <PieChart
            data={data3}
            width={width}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          {this.renderSecoes()}
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
    margin: 10,
    marginTop: normalize(85),
    borderRadius: 10,
    shadowColor: "#444",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    paddingLeft: 10,
    padding: 5,
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

  header: {
    flexDirection: "row",
  },
  container: {
    backgroundColor: AppStyles.color.background,
    flex: 1,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  containerList: {
    borderRadius: 10,
    width: "100%",
    flex: 1,
  },
  title: {
    fontSize: AppStyles.fontSize.normal,
    fontWeight: "normal",
    textAlign: "center",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#000000",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1,
    height: Dimensions.get("window").width / numColumns, // approximate a square
  },
  item1: {
    backgroundColor: "#000000",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1,
    height: Dimensions.get("window").width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
  },
  itemNumber: {
    color: "#fff",
    fontSize: normalize(30),
  },
  itemText1: {
    color: "#FCCB0A",
    textAlign: "center",
    justifyContent: "center",
  },
  itemNumber1: {
    color: "#FCCB0A",
    fontSize: normalize(30),
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(StatsScreen);
