import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { addNewItemsToPKO, addNewItemsToRequests, addNewItemsToReturns, checkTableExist, createTablePKO, createTableRequests, createTableReturns, createTableUnsyncPKO, createTableUnsyncRequests, createTableUnsyncReturns, deleteItem, getAllItems, getDBConnection } from '../db/db';
import { GetCashOrders, GetRequests, GetReturns, SendNewCashOrder, SendNewRequest, SendNewReturn } from '../API/api';


export const SyncOrders = async (conn) => {
        const db = await getDBConnection();
        await createTableUnsyncRequests(db, 'unsyncReqs');
        const items = await getAllItems(db, 'unsyncReqs');

        if (items.length){
            const token = await AsyncStorage.getItem('@token');
            items.map(async(i) => {
                const id = i.id;
                delete i.id;
                delete i.client_name;
                delete i.store_name;
                delete i.order_date;
                delete i.sync_status;
                i.list = JSON.parse(i.list);
                console.log(i);
                const resp = await SendNewRequest(token, i);
                if (resp.status == 'ok'){
                    console.log('order synced');
                    deleteItem(db, 'unsyncReqs', id);
                    var requests = await GetRequests(token);
                    var clientsToAdd = await getAllItems(db, 'clients');
                    if (requests.status == 'ok'){
                        await createTableRequests(db, 'requests');
                        await requests.orders.map(i => {
                          var client = clientsToAdd.find(c => c.id == i.client_id);
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
                    }
                    Toast.show('Заявка синхронизирована');
                    return true;
                }
                return false;
            })
        }
}

export const SyncReturns = async (conn) => {
    const db = await getDBConnection();

    await createTableUnsyncReturns(db, 'unsyncReturns');
    const items = await getAllItems(db, 'unsyncReturns');
    //const {refresher, setRefresher} = useContext(RefresherContext);

    if (items.length){
        const token = await AsyncStorage.getItem('@token');
        items.map(async(i) => {
            const id = i.id;
            delete i.id;
            delete i.client_name;
            delete i.store_name;
            delete i.order_date;
            delete i.sync_status;
            i.list = JSON.parse(i.list);
            console.log(i);
            const resp = await SendNewReturn(token, i);
            if (resp.status == 'ok'){
                console.log('order synced');
                deleteItem(db, 'unsyncReturns', id);
                var requests = await GetReturns(token);
                var clientsToAdd = await getAllItems(db, 'clients');
                if (requests.status == 'ok'){
                    await createTableReturns(db, 'returns');
                    await requests.orders.map(i => {
                      var client = clientsToAdd.find(c => c.id == i.client_id);
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
                    await addNewItemsToReturns(db, 'returns', requests.orders);
                    //setRefresher(!refresher);
                }
                Toast.show('Возврат синхронизирован');
                return true;
            }
            return false;
        })
    }
}

export const SyncPKO = async (conn) => {
    const db = await getDBConnection();

    await createTableUnsyncPKO(db, 'unsyncPKO');
    const items = await getAllItems(db, 'unsyncPKO');
    //const {refresher, setRefresher} = useContext(RefresherContext);

    if (items.length){
        const token = await AsyncStorage.getItem('@token');
        items.map(async(i) => {
            const id = i.id;
            delete i.id;
            delete i.client_name;
            delete i.store_name;
            delete i.order_date;
            delete i.sync_status;
            i.organization_id = i.supplier_id;
            i.organization_guid = i.supplier_guid;
            console.log(i);
            const resp = await SendNewCashOrder(token, i);
            console.log(resp)
            if (resp.status == 'ok'){
                console.log('order synced');
                var requests = await GetCashOrders(token);
                var clientsToAdd = await getAllItems(db, 'clients');
                var suppliers = await getAllItems(db, 'suppliers');
                if (requests.status == 'ok'){
                    deleteItem(db, 'unsyncPKO', id);
                    await createTablePKO(db, 'pko');
                    await requests.cash_order_receipts.map(i => {
                        var supplier = suppliers.find(s => s.id == i.organization_id);
                        var client = clientsToAdd.find(c => c.id == i.client_id);
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
                        console.log(supplier)
                        console.log(supplier.name)
                        i.supplier_name = supplier.name;
                        i.supplier_id = supplier.id;
                        i.supplier_guid = supplier.guid;
                        i.order_date = i.created_at.substring(0, 10);
                        i.comment = i.comment.replace(/[']+/g, "''");

                    })
                    await addNewItemsToPKO(db, 'pko', requests.cash_order_receipts);
                    //setRefresher(!refresher);
                }
                Toast.show('ПКО синхронизирован');
                return true;
            }
            return false;
        })
    }
}

export const TryResponseJson = (data) => {
    console.log(JSON.parse(data));
    try{
        var resp = data.json();
        return resp;
    }
    catch{
        return {
            'status': 'got error'
        }
    }
}
