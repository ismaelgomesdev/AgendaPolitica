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
  useShadowColorFromDataset: false // optional
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
      quantidade_bairro: null,
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
        quantidade_bairro,
      } = response.data;
      this.setState({
        quantidade: quantidade,
        quantidade_lider: quantidade_lider,
        quantidade_semana: quantidade_semana,
        quantidade_mes: quantidade_mes,
        quantidade_bairro: quantidade_bairro,
      });
      /*this.setState({
        totalEleitores: response.data,
      });*/
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
          <Text style={styles.itemText}>Total de eleitores cadastrados:</Text>

          <Text style={styles.itemNumber}>
            <Text style={styles.itemNumber}>{item.quantidade}</Text>
          </Text>
        </View>
      );
    } else if (item.quantidade_semana != null) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>Novos eleitores nesta semana:</Text>
          <Text style={styles.itemNumber}>{item.quantidade_semana}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>Novos eleitores neste mês:</Text>
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
        <Text style={styles.itemText}>eleitores</Text>
      </View>
    );
  };

  render() {
    if (tipoLogado == "candidato") {
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
      const data2 = [
        {
          name: "Nossa Sra. das Graças",
          population: 21500000,
          color: "#6681bb",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Canindezinho",
          population: 2800000,
          color: "#56b9c3",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Riacho São Francisco",
          population: 527612,
          color: "#439185",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Bela Vista",
          population: 8538000,
          color: "#316a4c",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Campinas",
          population: 11920000,
          color: "#1d4317",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Boa Vista",
          population: 11920000,
          color: "#3c631d",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Conjunto Habitacional",
          population: 11920000,
          color: "#758427",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Alto Guaramiranga",
          population: 11920000,
          color: "#b7a239",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Palestina",
          population: 11920000,
          color: "#f5bc58",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Jubaia",
          population: 11920000,
          color: "#6eafe1",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "São Mateus",
          population: 11920000,
          color: "#5e548d",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Cachoeira da Pasta",
          population: 11920000,
          color: "#678ac1",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "João Paulo II",
          population: 11920000,
          color: "purple",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Monte",
          population: 11920000,
          color: "pink",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Cap. Pedro Sampaio",
          population: 11920000,
          color: "red",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Santa Luzia",
          population: 11920000,
          color: "orange",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Imaculada Conceição",
          population: 11920000,
          color: "grey",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Santa Clara",
          population: 11920000,
          color: "black",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Centro",
          population: 11920000,
          color: "yellow",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
      ];

      const data3 = [
        {
          name: "Bonito",
          population: 21500000,
          color: "#6eafe1",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Campos",
          population: 2800000,
          color: "#f5bc58",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Caiçara",
          population: 527612,
          color: "#b7a239",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Capitão Pedro Sampaio",
          population: 8538000,
          color: "#758427",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Esperança",
          population: 11920000,
          color: "#3c631d",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Iguaçu",
          population: 11920000,
          color: "#1d4317",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Ipueiras dos Gomes",
          population: 11920000,
          color: "#316a4c",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Monte Alegre",
          population: 11920000,
          color: "#439185",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Salitre",
          population: 11920000,
          color: "#56b9c3",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: "Targinos",
          population: 11920000,
          color: "#6681bb",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }
      ];

      return (
        <ScrollView style={styles.container}>
          <FlatList
            data={formatData(data, numColumns)}
            style={styles.container}
            renderItem={this.renderItem}
            numColumns={numColumns}
          />

          <View>
            <Text style={styles.title}>Evolução mensal</Text>
            <LineChart
              data={{
                labels: ["Maio", "Junho"],
                datasets: [
                  {
                    data: [1, 5],
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
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
          <Text style={styles.title}>Desempenho dos líderes</Text>
          <FlatList
            data={formatData(porLider, numColumns)}
            style={styles.container}
            renderItem={this.renderItem2}
            numColumns={numColumns}
          />
          <Text style={styles.title}>Eleitores por bairro</Text>
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
          <Text style={styles.title}>Eleitores por distrito</Text>
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
          
        </ScrollView>
      );
    } else {
      const { disabled } = this.state;
      return <ScrollView style={styles.container}></ScrollView>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 1,
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
