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

      loading: false,
      data: [],
      error: null,
      disabled: true,
      quantidade: null,
      quantidade_lider: [],
      quantidade_semana: null,
      quantidade_mes: null,
      quantidade_mes2: [],
      quantidade_local: [],
      labels: [],
      datasets: [],
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
      } = response.data;
      this.setState({
        quantidade: quantidade,
        quantidade_lider: quantidade_lider,
        quantidade_semana: quantidade_semana,
        quantidade_mes: quantidade_mes,
        quantidade_mes2: quantidade_mes2,
        quantidade_local: quantidade_local,
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
      console.log(err);
    }
  };

  componentDidMount() {
    this.makeRemoteRequest();
    this.makeRemoteRequest2();
    this.totalEleitores();
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

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    if (item.quantidade != null) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>Total de membros da equipe:</Text>

          <Text style={styles.itemNumber}>
            <Text style={styles.itemNumber}>{item.quantidade}</Text>
          </Text>
        </View>
      );
    } else if (item.quantidade_semana != null) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>Novos membros nesta semana:</Text>
          <Text style={styles.itemNumber}>{item.quantidade_semana}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>Novos membros neste mês:</Text>
          <Text style={styles.itemNumber}>{item.quantidade_mes}</Text>
        </View>
      );
    }
  };

  renderItem2 = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.nome_lider}</Text>
        <Text style={styles.itemNumber}>{item.quantidade_lider}</Text>
        <Text style={styles.itemText}>membros</Text>
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
                    backgroundColor: "#E2B500",
                    backgroundGradientFrom: "#3179CF",
                    backgroundGradientTo: "#2F70BD",
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
                      stroke: "#ffa726",
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
    backgroundColor: "#3179CF",
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
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(StatsScreen);
