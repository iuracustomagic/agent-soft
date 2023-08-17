import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { GetNomenclatures, GetClients, GetSuppliers, GetCategories, PreSync, GetRequests, GetTypesOfReturns, GetReturns, GetCashOrders } from '../../API/api';
import { consts } from '../../consts/const';
import {addNewItemsToCategories, addNewItemsToClients, addNewItemsToNomenclatures, addNewItemsToPKO, addNewItemsToRequests, addNewItemsToReturns, addNewItemsToSuppliers, addNewItemsToTypesOfReturns, clearTable, createTableCategories, createTableClients, createTableNomenclatures, createTablePKO, createTableRequests, createTableReturns, createTableSuppliers, createTableTypesOfReturns, createTableUnsyncPKO, createTableUnsyncRequests, createTableUnsyncReturns, deleteTable, getAllItems, getDBConnection} from '../../db/db';
import Toast from 'react-native-simple-toast';
import { NavigationContainer, useNavigationContainerRef, useNavigation } from '@react-navigation/native';
import { SyncOrders, SyncPKO, SyncReturns } from '../../utils/Helper';
import { RefresherContext } from '../../context';


export const LeftSideMenu = ({visible, opener, navigation}) => {

    const {refresher, setRefresher} = useContext(RefresherContext);
    const [name, setName] = useState('');

    const navig = useNavigation();
    //navig.navigate('RequestScreen')

    function doNavigation(data){
        navig.navigate(data);
        closer();
    }

    async function updater(){  
        const token = await AsyncStorage.getItem('@token');
        var preSync = await PreSync(token);
        if (preSync.status == 'ok'){
          Toast.show('Выполняется синхронизация. Это может занять некоторое время.');
          var nomenclaturesToAdd = await GetNomenclatures(token);
          var clientsToAdd = await GetClients(token);
          console.log(clientsToAdd.clients);
          const db = await getDBConnection();
          
          var suppliers = await GetSuppliers(token);
          var categories = await GetCategories(token);
          var requests = await GetRequests(token);
          var typesOfReturns = await GetTypesOfReturns(token);
          var returns = await GetReturns(token);
          var pkos = await GetCashOrders(token);
          await createTableTypesOfReturns(db, 'typesOfReturns');
          await createTableUnsyncRequests(db, 'unsyncReqs');
          await createTableUnsyncReturns(db, 'unsyncReturns');
          await createTableUnsyncPKO(db, 'unsyncPKO');
          /* await deleteTable(db, 'nomenclatures');
          await deleteTable(db, 'clients');
          await deleteTable(db, 'unsyncReqs');
          await deleteTable(db, 'requests');
          await deleteTable(db, 'returns');
          await deleteTable(db, 'unsyncReturns');
          await deleteTable(db, 'unsyncPKO');
          await deleteTable(db, 'pko'); */
          if (typesOfReturns.status == 'ok'){
            await clearTable(db, 'typesOfReturns')
            if (typesOfReturns.types.length){
              await addNewItemsToTypesOfReturns(db, 'typesOfReturns', typesOfReturns.types);
            }
          }
          if (suppliers.status == 'ok'){
              await createTableSuppliers(db, 'suppliers');
              await clearTable(db, 'suppliers');
              if (suppliers.suppliers.length){
                await addNewItemsToSuppliers(db, 'suppliers', suppliers.suppliers);
              }
              Toast.show('Поставщики добавлены');
          }
          else
            return false
          
            
          if (nomenclaturesToAdd.status == 'ok'){
              //Toast.show('Status ok');
              await createTableNomenclatures(db, 'nomenclatures');
              await clearTable(db, 'nomenclatures');
              console.log(nomenclaturesToAdd.nomenclature)
              var flagCat = false;
              if (categories.status == 'ok')
                  flagCat = true
              //Toast.show('Table created');
              if (categories.categories.length){
                await nomenclaturesToAdd.nomenclature.map((i) => {
                    if (i.balance == '')
                        i.balance = 'null';
                    else
                        i.balance = JSON.stringify(i.balance);
                    if (i.name.indexOf("'") != -1){
                        //i.name = i.name.replaceAll("/'", "/'/'");
                        i.name = i.name.replace(/[']+/g, "''");
                    }
                    if (flagCat)
                        categories.categories.find(c => c.id == i.category_id).sup_id = i.organization_id;
                    if (i.prices == '')
                        i.prices = 'null';
                    else
                        i.prices = JSON.stringify(i.prices);
                })
                //Toast.show('nomenclatures map3');
                await addNewItemsToNomenclatures(db, 'nomenclatures', nomenclaturesToAdd.nomenclature);
                //Toast.show('nomenclatures added');
                //console.log(getAllItems(db, 'nomenclatures'));
                Toast.show('Номенклатуры добавлены');
              }
              if (categories.status == 'ok'){
                  await createTableCategories(db, 'categories');
                  await clearTable(db, 'categories');
                  if (categories.categories.length){
                    categories.categories.map(i => {
                        if (i.name.indexOf("'") != -1){
                            i.name = i.name.replace(/[']+/g, "''");
                        }
                    })
                    console.log(categories.categories);
                    await addNewItemsToCategories(db, 'categories', categories.categories);
                    Toast.show('Категории добавлены');
                  }
              }
              else
                return false
              
              
          }
          else
            return false
          if (clientsToAdd.status == 'ok'){
              //console.log(Object.keys(clientsToAdd.clients[0]).join(", "))
              await createTableClients(db, 'clients');
              await clearTable(db, 'clients');
              if (clientsToAdd.clients.length){
                clientsToAdd.clients.map(i => {
                    if (i.statuses == '')
                        i.statuses = 'null';
                    else
                        i.statuses = JSON.stringify(i.statuses);
                    if (i.stores == '')
                        i.stores = 'null';
                    else
                        i.stores = JSON.stringify(i.stores);
                    //i.name = i.name.replaceAll("'", "''");
                })
                await addNewItemsToClients(db, 'clients', clientsToAdd.clients);
                //console.log(getAllItems(db, 'clients'));
                Toast.show('Контрагенты добавлены');
              }
          }
          else
            return false
    
          if (returns.status == 'ok'){
            await createTableReturns(db, 'returns');
            await clearTable(db, 'returns');
    
            if (returns.orders.length){
              await returns.orders.map(i => {
                var client = clientsToAdd.clients.find(c => c.id == i.client_id);
                //console.log
                if (client)
                    i.client_name = client.name.replace(/[']+/g, "''");
                else
                    i.client_name = 'noname'
                //console.log(JSON.parse(client.stores).find(s => s.id == i.store_id))
                if (client)
                    if (client.stores != 'null')
                        if (JSON.parse(client.stores).find(s => s.id == i.store_id))
                            i.store_name = JSON.parse(client.stores).find(s => s.id == i.store_id).name.replace(/[']+/g, "''");
                        else
                            i.store_name = 'null';
                else
                    i.store_name = 'null'
                i.list = i.list.replace(/[']+/g, "''");
                
                i.order_date = i.created_at.substring(0, 10);
              })
              console.log(returns.orders)
              await addNewItemsToReturns(db, 'returns', returns.orders);
            }
          }
          else
            return false
    
          if (pkos.status == 'ok'){
            await createTablePKO(db, 'pko');
            await clearTable(db, 'pko');
    
            if (pkos.cash_order_receipts.length){
              await pkos.cash_order_receipts.map(i => {
                var client = clientsToAdd.clients.find(c => c.id == i.client_id);
                var supplier = suppliers.suppliers.find(s => s.id == i.organization_id);
                if (client)
                    i.client_name = client.name.replace(/[']+/g, "''");
                else
                    i.client_name = 'noname'
                if (client)
                    if (client.stores != 'null')
                      if (JSON.parse(client.stores).find(s => s.id == i.store_id))
                        i.store_name = JSON.parse(client.stores).find(s => s.id == i.store_id).name.replace(/[']+/g, "''");
                      else
                        i.store_name = 'null';
                  else
                    i.store_name = 'null'
                i.supplier_name = supplier.name;
                i.supplier_id = supplier.id;
                i.supplier_guid = supplier.guid;
                i.order_date = i.created_at.substring(0, 10);
                i.comment = i.comment.replace(/[']+/g, "''");
              })
              console.log(pkos.cash_order_receipts)
              await addNewItemsToPKO(db, 'pko', pkos.cash_order_receipts);
            }
          }
          else
            return false
    
          if (requests.status == 'ok'){
            await createTableRequests(db, 'requests');
            //await clearTable(db, 'requests');
            if (requests.orders.length){
              await requests.orders.map(i => {
                var client = clientsToAdd.clients.find(c => c.id == i.client_id);
                //console.log
                if (client)
                    i.client_name = client.name.replace(/[']+/g, "''");
                else
                    i.client_name = 'noname'
                //console.log(JSON.parse(client.stores).find(s => s.id == i.store_id))
                if (client)
                    if (client.stores != 'null')
                        if (JSON.parse(client.stores).find(s => s.id == i.store_id))
                            i.store_name = JSON.parse(client.stores).find(s => s.id == i.store_id).name.replace(/[']+/g, "''");
                        else
                            i.store_name = 'null';
                else
                    i.store_name = 'null'
                i.list = i.list.replace(/[']+/g, "''");
                i.order_date = i.created_at.substring(0, 10);
              })
              await addNewItemsToRequests(db, 'requests', requests.orders);
              console.log(requests)
              Toast.show('Заявки добавлены');
            }
          }
          else
            return false
          //const items = await getAllItems(db, 'nomenclatures')
          //console.log(items);
          return true;
        }
      }

    const closer = () => {
        opener(false);
    }

    const send = () => {
        if (SyncOrders())
            setRefresher(!refresher)
        if (SyncReturns())
            setRefresher(!refresher)
        if (SyncPKO())
            setRefresher(!refresher)
    }

    const onShow = async () => {
        try{
            var naming = await AsyncStorage.getItem('@login');
            naming = naming.replace('@agg.md', '').split('_');
            naming = naming.map((i) => {
                i = i.charAt(0).toUpperCase() + i.slice(1);
                return i
            })
            naming = naming.join(' ');
            setName(naming);
        }
        catch{
            setName();
        }
    }
    
    return(
        <Modal
            onShow={onShow}
            isVisible={visible}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            style={style.backdrop}
            onBackdropPress={closer}
            onSwipeComplete={closer}
            swipeDirection="left"
            hideModalContentWhileAnimating={true}
            children={
                <View style={style.background}>
                    <View style={style.top2}>
                        <View style={style.top1}>
                            <View style={style.userSec}>  
                                <View style={style.userAvatar}>
                                    <FontAwesome5
                                        size={60}
                                        color='#DFDFDF'
                                        name='user-alt'
                                    />
                                </View>
                                <Text style={style.username}>
                                    {name ? name : 'Username'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={style.menu}>
                        <View style={style.mainList}>
                            <TouchableOpacity
                                onPress={() => doNavigation('Home')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Главная</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('ReturnScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.RETURN}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('RequestScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.REQUEST}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => doNavigation('PKOScreen')}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.PKO}</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => updater()}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Обновление</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => send()}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>Отправить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.OPTIONS}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    await AsyncStorage.removeItem('@login');
                                    await AsyncStorage.removeItem('@pass');
                                    await AsyncStorage.removeItem('@token');
                                    doNavigation('Login');
                                }}
                                style={style.liBtn}
                            >
                                <Text style={style.liText}>{consts.LOGOUT}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={style.bottomList}>
                            
                        </View> */}
                    </View>
                </View>
                    
                
            }
        >
            
        
        </Modal>
    )
}

const style = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        maxWidth: '80%',
        flex: 1
    },
    backdrop: {
        margin: 0,
        height: '100%',
    },
    top2: {
        backgroundColor: '#ff6365',
        height: 160,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    top1: {
        paddingTop: 10,
        backgroundColor: 'white',
        height: 120,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    userSec: {
        alignItems: 'center',
    },
    userAvatar: {
        borderRadius: 1000,
        borderWidth: 2,
        borderColor: '#ff6365',
        overflow: 'hidden'
    },
    username: {
        color: 'black',
        fontSize: 20
    },
    menu: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 30,
        marginTop: 30
    },
    mainList: {

    },
    bottomList: {

    },
    liBtn: {
        paddingVertical: 5
    },
    liText: {
        textTransform: 'capitalize',
        fontSize: 20,
        color: 'black'
    }
})