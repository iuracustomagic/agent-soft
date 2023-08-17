import React, { useState, useEffect, useCallback} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {  NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RequestScreen } from './src/screens/RequestScreen';
import { PkoScreen } from './src/screens/PkoScreen';
import { ReturnScreen } from './src/screens/ReturnScreen';
import { NewRequestScreen } from './src/screens/NewRequestScreen';
import { NewReturnScreen } from './src/screens/NewReturnScreen';
import { NewPkoScreen } from './src/screens/NewPkoScreen';
import HeaderBar from './src/components/HeaderBar';
import { NavigatorContext, NetworkContext, RefresherContext } from './src/context';
import NetInfo from "@react-native-community/netinfo";
import { getDBConnection } from './src/db/db';
import { SendNewRequest } from './src/API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { SyncOrders, SyncPKO, SyncReturns } from './src/utils/Helper';
import { LeftSideMenu } from './src/components/modals/LeftSideMenu';
import * as Font from "expo-font";

import Apploading from "expo-app-loading";

SplashScreen.preventAutoHideAsync();

const getFonts = () =>
    Font.loadAsync({
      'JosefinSans-Regular': require('./assets/fonts/Josefin_Sans/JosefinSans-Regular.ttf'),
      'AntDesign': require("./assets/fonts/AntDesign.ttf"),
      'FontAwesome': require("./assets/fonts/FontAwesome5_Solid.ttf"),
      'FontAwesome5_Solid': require("./assets/fonts/FontAwesome5_Solid.ttf"),
    });

const App = () => {

  const [conn, setConn] = useState(true);
  const [network, setNetwork] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const [headervs, setHeadervs] = useState(true);
  const [lsMenu, setlsMenu] = useState(false);
  const [fontsloaded, setFontsLoaded] = useState(false);
  //const {navigator, setNavigator} = useContext(NavigatorContext);

  const headerVis = (value) => {
    setHeadervs(value);
  }
  const lsMenuVis = (value) => {
    setlsMenu(value);
  }

  useEffect(() => {
    if (conn)
      if (SyncOrders(conn))
        setRefresher(!refresher)
    if (SyncReturns(conn))
      setRefresher(!refresher)
    if (SyncPKO(conn))
      setRefresher(!refresher)
    //console.log('------------')
    //Toast.show('connection has changed')
  }, [conn])

  const unsubscribe = NetInfo.addEventListener(state => {
    console.log("Is connected?", state.isConnected);
    setTimeout(() => {
      setNetwork(state.isConnected);
      setConn(state.isConnected);
    }, 50)

  });


  const Stack = createNativeStackNavigator();



if(fontsloaded) {
  return (
      <NavigationContainer>
        <NetworkContext.Provider
            value={{
              network,
              setNetwork
            }}
        >
          <RefresherContext.Provider
              value={{
                refresher,
                setRefresher
              }}
          >

            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{header: () => <HeaderBar lsMenu={lsMenuVis} />}}
            >
              <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{headerShown: false}}
              />
              <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Welcome' }}
              />
              <Stack.Screen
                  name="RequestScreen"
                  component={RequestScreen}
              />
              <Stack.Screen
                  name="PKOScreen"
                  component={PkoScreen}
              />
              <Stack.Screen
                  name="ReturnScreen"
                  component={ReturnScreen}
              />
              <Stack.Screen
                  name="NewRequestScreen"
                  component={NewRequestScreen}
              />
              <Stack.Screen
                  name="NewReturnScreen"
                  component={NewReturnScreen}
              />
              <Stack.Screen
                  name="NewPKOScreen"
                  component={NewPkoScreen}
              />
            </Stack.Navigator>

            <LeftSideMenu
                visible={lsMenu}
                opener={lsMenuVis}
            />
          </RefresherContext.Provider>
        </NetworkContext.Provider>
      </NavigationContainer>

  );} else {
  return (
      <Apploading
          startAsync={getFonts}
          onFinish={() => {
            setFontsLoaded(true);
          }}
          onError={console.warn}
      />
  );
}

}

export default App;
