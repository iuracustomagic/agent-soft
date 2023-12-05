import React, {useState, useEffect, useContext} from 'react';
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
import {CopyRequestScreen} from "./src/screens/CopyRequestScreen";
import HeaderBar from './src/components/HeaderBar';
import {NetworkContext, RefresherContext} from './src/context';
import NetInfo from "@react-native-community/netinfo";

import { SyncOrders, SyncPKO, SyncReturns } from './src/utils/Helper';
import { LeftSideMenu } from './src/components/modals/LeftSideMenu';
import * as Font from "expo-font";

import Apploading from "expo-app-loading";
import {CopyPkoScreen} from "./src/screens/CopyPkoScreen";
import {CleanScreen} from "./src/screens/CleanScreen";
import {CleanRequestScreen} from "./src/screens/CleanRequestScreen";
import {CleanReturnScreen} from "./src/screens/CleanReturnScreen";
import {CleanPkoScreen} from "./src/screens/CleanPkoScreen";
import {EditRequestScreen} from "./src/screens/EditRequestScreen";
import {EditReturnScreen} from "./src/screens/EditReturnScreen";
import {EditPkoScreen} from "./src/screens/EditPkoScreen";

SplashScreen.preventAutoHideAsync();

const getFonts = () =>
    Font.loadAsync({
      'JosefinSans-Regular': require('./assets/fonts/Josefin_Sans/JosefinSans-Regular.ttf'),
      'AntDesign': require("./assets/fonts/AntDesign.ttf"),
      'FontAwesome': require("./assets/fonts/FontAwesome5_Solid.ttf"),
      'FontAwesome5_Solid': require("./assets/fonts/FontAwesome5_Solid.ttf"),
      'FontAwesome5_Regular': require("./assets/fonts/FontAwesome5_Solid.ttf"),
    });

const App = () => {

  const [conn, setConn] = useState(true);
  const [network, setNetwork] = useState(false);

  const [refresher, setRefresher] = useState(false);
  const [lsMenu, setlsMenu] = useState(false);
  const [fontsloaded, setFontsLoaded] = useState(false);
    const [cloud, setCloud] = useState(true)


  const lsMenuVis = (value) => {
    setlsMenu(value);
  }

  // useEffect(() => {
  //   if (conn)
  //     if (SyncOrders(conn))
  //       setRefresher(!refresher)
  //   if (SyncReturns(conn))
  //     setRefresher(!refresher)
  //   if (SyncPKO(conn))
  //     setRefresher(!refresher)
  //
  // }, [conn])

    useEffect(()=>{

        if(cloud) {
        NetInfo.addEventListener(state => {
                setTimeout(() => {
                    setNetwork(state.isConnected);
                    setConn(state.isConnected);
                }, 50)
        });
        } else setNetwork(false)
        console.log("network", network);
        console.log("cloud", cloud);
    },[cloud])




  const Stack = createNativeStackNavigator();



if(fontsloaded) {
  return (
      <NavigationContainer>
        <NetworkContext.Provider
            value={{
              network,
              setNetwork,

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
                screenOptions={{header: () => <HeaderBar lsMenu={lsMenuVis} setCloud={setCloud} cloud={cloud}/>}}
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
                    name="CopyRequestScreen"
                    component={CopyRequestScreen}
                />
              <Stack.Screen
                  name="NewReturnScreen"
                  component={NewReturnScreen}
              />
              <Stack.Screen
                  name="NewPKOScreen"
                  component={NewPkoScreen}
              />
                <Stack.Screen
                    name="CopyPkoScreen"
                    component={CopyPkoScreen}
                />
                <Stack.Screen
                    name="CleanScreen"
                    component={CleanScreen}
                />
                <Stack.Screen
                    name="CleanRequestScreen"
                    component={CleanRequestScreen}
                />
                <Stack.Screen
                    name="CleanReturnScreen"
                    component={CleanReturnScreen}
                />
                <Stack.Screen
                    name="CleanPkoScreen"
                    component={CleanPkoScreen}
                />
                <Stack.Screen
                    name="EditRequestScreen"
                    component={EditRequestScreen}
                />
                <Stack.Screen
                    name="EditReturnScreen"
                    component={EditReturnScreen}
                />
                <Stack.Screen
                    name="EditPkoScreen"
                    component={EditPkoScreen}
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
