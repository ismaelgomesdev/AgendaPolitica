/* eslint-disable global-require */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableHighlight, Text } from "react-native";

class BottomNav extends Component {
  static propTypes = {
    navigation: PropTypes.shape({}),
    getOnPress: PropTypes.func,
    getLabel: PropTypes.func,
    renderIcon: PropTypes.func,
    jumpToIndex: PropTypes.func,
  };

  static defaultProps = {
    navigation: {},
    getOnPress: () => {},
    getLabel: () => {},
    renderIcon: () => {},
    jumpToIndex: () => {},
  };

  render = () => {
    const {
      navigation,
      getOnPress,
      getLabel,
      renderIcon,
      jumpToIndex,
    } = this.props;
    const { routes } = navigation.state;
    const tabList = routes.map((route, index) => {
      const focused = index === navigation.state.index;
      const scene = { route, index, focused };
      const label = getLabel({ ...scene });
      const icon = renderIcon({ ...scene });
      const onPress = getOnPress(scene);
      /* eslint-disable arrow-body-style */
      return (
        <TouchableHighlight
          style={{
            flex: 0.3,
            paddingTop: 5,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
          onPress={() => {
            return onPress ? onPress(scene, jumpToIndex) : jumpToIndex(index);
          }}
          key={`tab-${route.key}`}
          underlayColor="#f1f1f1"
        >
          <View>
            {icon}
            <Text
              style={{
                alignSelf: "center",
                paddingBottom: 5,
                color: smallTextColor,
                fontSize: 10,
                marginLeft: 5,
              }}
            >
              {label}
            </Text>
          </View>
        </TouchableHighlight>
      );
    });
    return <View style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      borderTopColor: '#f1f1f1',
      borderTopWidth: 1,
    }}>{tabList}</View>;
  };
}

export default BottomNav;
