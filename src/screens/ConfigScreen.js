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
  Switch
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

let idLogado = "";
let nomeLogado = "";
let tipoLogado = "";
let data2 = [];
let data3 = [];
const numColumns = 3;
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

class ConfigScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "teste",
      idLog: "",
      nomeLog: "",
      tipoLog: "",

      errorMessage: "",

      loading: false,

      value: false,
    };
  }

  static navigationOptions = ({ navigation }) => ({});

  componentDidMount() {
    this.makeRemoteRequest();
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
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    if (tipoLogado == "candidato") {
      return (
        <ScrollView style={styles.container}>
          <Switch
            value={this.state.value}
            onValueChange={(v) => {
              this.setState({value: v})
            }}
          />
        </ScrollView>
      );
    } else {
      const { disabled } = this.state;
      return (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Tela de configuração :D</Text>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 1,
  },
  title: {
    justifyContent: "center",
    /*fontSize: AppStyles.fontSize.normal,
    fontWeight: "normal",
    textAlign: "center",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,*/
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

export default connect(mapStateToProps)(ConfigScreen);
