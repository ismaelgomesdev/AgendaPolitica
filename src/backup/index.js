import React, { Component } from 'react';
import { StatusBar } from 'react-native';


import Routes from './routes';

export default class App extends Component {
  constructor(props){
    super(props);
  }
    render(){
      return(
        <>
          <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
          />
          <Routes />
        </>
      )
    }
}
