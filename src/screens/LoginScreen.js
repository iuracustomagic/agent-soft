import React, { useEffect, useState, useRef } from 'react';

import {
  Text,
  View,
  Image
} from 'react-native';

import { consts, ver } from '../consts/const';
import { styles } from '../styles/styles';
import { DefaultTextInput } from '../components/DefaultTextInput';
import { DefaultBtn } from '../components/DefaultBtn';

import { Auth, AuthTest } from '../API/auth';
import Toast from 'react-native-simple-toast';
import { Loading } from '../components/modals/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetCashOrders, GetCategories, GetClients, GetNomenclatures, GetRequests, GetReturns, GetSuppliers, GetTypesOfReturns, PreSync } from '../API/api';
import { addNewItemsToCategories, addNewItemsToClients, addNewItemsToNomenclatures, addNewItemsToPKO, addNewItemsToRequests, addNewItemsToReturns, addNewItemsToSuppliers, addNewItemsToTypesOfReturns, clearTable, createTableCategories, createTableClients, createTableNomenclatures, createTablePKO, createTableRequests, createTableReturns, createTableSuppliers, createTableTypesOfReturns, createTableUnsyncPKO, createTableUnsyncRequests, createTableUnsyncReturns, deleteTable, getAllItems, getDBConnection } from '../db/db';
import { openDatabase } from 'expo-sqlite';



export const LoginScreen = ({navigation}) => {

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const inputPas = useRef();

  const nextInp = () => {
    inputPas.current.focus();
  }

  useEffect(() => {
    async function checker(){
      if (AsyncStorage.getItem('@login') && AsyncStorage.getItem('@pass')){
          setLoading(true);
          const login1 = await AsyncStorage.getItem('@login');
          console.log(login1)
          const pass1 = await AsyncStorage.getItem('@pass');
          console.log(pass1)
          //if (login && pass)
          const tryAuth = await Auth(login1, pass1);
          console.log(3)
          if (tryAuth.status == 'ok'){
            await AsyncStorage.setItem('@token', tryAuth.token);
            if (await updater())
              navigation.navigate('Home');
            else
              Toast.show('Что-то пошло не так...');
          }
          else
            Toast.show('Проблема при авторизации');
          setLoading(false);
        }
      }
    checker();
  }, [])


  async function nextScreen(value){

      if (!login.length || !pass.length){
        Toast.show('Введите логин и пароль');
      }
      else{
        setLoading(true);
        const tryAuth = await Auth(login, pass);
        if (tryAuth.status == "ok"){
          await AsyncStorage.setItem('@login', login);
          await AsyncStorage.setItem('@pass', pass);
          await AsyncStorage.setItem('@token', tryAuth.token);

          if (await updater())
            navigation.navigate('Home');
          else
            Toast.show('Ошибка соединения')
        }
        else
          Toast.show('Что-то пошло не так...');
        setLoading(false);
      }
  }

  async function updater(){
    try {
      const token = await AsyncStorage.getItem('@token');
      var preSync = await PreSync(token);
      console.log(preSync);
      if (preSync.status == 'ok'){
        Toast.show('Выполняется синхронизация. Это может занять некоторое время.');
        var nomenclaturesToAdd = await GetNomenclatures(token);
        console.log('-----------------------NOMENCLATURES')

        var clientsToAdd = await GetClients(token);
        console.log('--------------------')
        console.log(clientsToAdd);

        // const db = await getDBConnection();
const db = openDatabase('db.db' );
        console.log('After DB connection--------------')
        var suppliers = await GetSuppliers(token);

        var categories = await GetCategories(token);

        var requests = await GetRequests(token);

        var typesOfReturns = await GetTypesOfReturns(token);

        var returns = await GetReturns(token);

        var pkos = await GetCashOrders(token);


        await createTableTypesOfReturns(db, 'typesOfReturns');
        console.log('end of createTableTypesOfReturns')
        await createTableUnsyncRequests(db, 'unsyncReqs');
        console.log('end of createTableUnsyncRequests')
        await createTableUnsyncReturns(db, 'unsyncReturns');
        console.log('end of createTableUnsyncReturns')
        await createTableUnsyncPKO(db, 'unsyncPKO');

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
          console.log(1)
          //Toast.show('Status ok');
          await createTableNomenclatures(db, 'nomenclatures');
          await clearTable(db, 'nomenclatures');
          console.log(nomenclaturesToAdd.nomenclature)
          var flagCat = false;
          if (categories.status == 'ok')
            flagCat = true
          //Toast.show('Table created');
          if (categories.categories.length){
            console.log(2)
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
              if (i.color == '')
                i.color == 'Default';
              if (i.prices == '')
                i.prices = 'null';
              else
                i.prices = JSON.stringify(i.prices);
            })
            console.log(nomenclaturesToAdd.nomenclature)
            //Toast.show('nomenclatures map3');
            await addNewItemsToNomenclatures(db, 'nomenclatures', nomenclaturesToAdd.nomenclature);
            //Toast.show('nomenclatures added');
            //console.log(getAllItems(db, 'nomenclatures'));
            console.log(4)
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
            clientsToAdd.clients.map(async (i) => {
              if (i.statuses == '')
                i.statuses = 'null';
              else{
                /* for (var key in i.statuses) {
                  if (!i.statuses[key])
                    i.statuses[key] = 'null'

                    console.log("Ключ: " + key + " значение: ")
                    console.log(i.statuses[key])
                } */
                if (i.statuses.indexOf("'") != -1){
                  //i.name = i.name.replaceAll("/'", "/'/'");
                  i.statuses = i.statuses.replace(/[']+/g, "''");
                }
                i.statuses = JSON.stringify(i.statuses);
              }

              for (var key in i) {
                if (JSON.stringify(i[key]).indexOf("'") != -1)
                  i[key] = JSON.parse(JSON.stringify(i[key]).replace(/[']+/g, "''"));
              }
              if (i.stores == '')
                i.stores = 'null';
              else
                i.stores = JSON.stringify(i.stores);
              //i.name = i.name.replaceAll("'", "''");
              //await addNewItemsToClients(db, 'clients', [i]);
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
          console.log(returns.orders)
          if (returns.orders.length > 0){
            await returns.orders.map(i => {
              var client = clientsToAdd.clients.find(c => c.id == i.client_id);
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

          if (pkos.cash_order_receipts.length > 0){
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
          if (requests.orders.length > 0){
            await requests.orders.map(i => {
              var client = clientsToAdd.clients.find(c => c.id == i.client_id);
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
    } catch (e) {
      console.log(e.message)
    }

  }

  return(
    <View style={styles.authFormBlock}>
      <View style={styles.authForm}>
        <Image
            style={styles.hsLogo}
            source={require('../img/agg_logo.png')}
        />
        <Text style={styles.authTitle}>{consts.AUTH}</Text>
        <DefaultTextInput
          placeholder={consts.LOGIN}
          onSubmitEditing={nextInp}
          onChangeText={setLogin}
          mt={15}
        />
        <DefaultTextInput
          innerRef={inputPas}
          placeholder={consts.PASSWORD}
          onChangeText={setPass}
          secureTextEntry={true}
          onEndEditing={nextScreen}
          mt={15}
        />
        <DefaultBtn
          text={consts.AUTH}
          callback={nextScreen}
          icon='user'
          upperText={true}
        />
      </View>
      <Loading visible={loading} text='Синхронизация'/>
      <Text style={styles.version}>v1.4 {ver}</Text>
    </View>
  )
}
