import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {
    addNewItemsToPKO,
    addNewItemsToRequests,
    addNewItemsToReturns,
    checkTableExist,
    clearTable,
    createTablePKO,
    createTableRequests,
    createTableReturns,
    createTableUnsyncPKO,
    createTableUnsyncRequests,
    createTableUnsyncReturns,
    deleteItem,
    getAllItems,
    getDBConnection
} from '../db/db';
import { GetCashOrders, GetRequests, GetReturns, SendNewCashOrder, SendNewRequest, SendNewReturn } from '../API/api';
import {CorrectDate, GetDate} from "./GetDate";
import {openDatabase} from "expo-sqlite";

const db = openDatabase('db.db' );
export const SyncOrders = async (conn) => {
        const db = await getDBConnection();
        // await createTableUnsyncRequests(db, 'unsyncReqs');
        const items = await getAllItems(db, 'unsyncReqs');
    console.log('unsyncReqs items', items)

    async function updateOrder(i, token) {
        const id = i.id;

        delete i.id;
        delete i.client_name;
        delete i.store_name;
        delete i.order_date;
        delete i.sync_status;
        i.list = JSON.parse(i.list);

        const resp = await SendNewRequest(token, i);
        if (resp.status == 'ok') {
            console.log('order synced');

            await deleteItem(db, 'unsyncReqs', id);
            await createTableRequests(db, 'requests');
            await createTableRequests(db, 'todayRequests');
            await clearTable(db, 'requests');
            await clearTable(db, 'todayRequests');

            var requests = await GetRequests(token);
            var clientsToAdd = await getAllItems(db, 'clients');
            if (requests.status == 'ok') {
                // await createTableRequests(db, 'requests');

                let todayOrders = []
                requests.orders.map(i => {
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
                    if(i.order_date == CorrectDate(GetDate('today'))){
                        todayOrders.push(i)

                    }
                })

                console.log('todayOrders in updateOrder', todayOrders)
              await addNewItemsToRequests(db, 'todayRequests', todayOrders);
                await addNewItemsToRequests(db, 'requests', requests.orders);

            }
            Toast.show('Заявка синхронизирована');
        }
    }
        if (items.length) {
            const token = await AsyncStorage.getItem('@token');
            for await (const item of items) {
                await updateOrder(item, token)
            }

        }


}

export const SyncReturns = async () => {
    const db = await getDBConnection();

    await createTableUnsyncReturns(db, 'unsyncReturns');
    const items = await getAllItems(db, 'unsyncReturns');
    //const {refresher, setRefresher} = useContext(RefresherContext);
    console.log('unsyncReturns', items)
    if (items.length){

        // await clearTable(db, 'unsyncReturns')

        const token = await AsyncStorage.getItem('@token');
        items.map(async(i) => {
            const id = i.id;
            delete i.id;
            delete i.client_name;
            delete i.store_name;
            delete i.order_date;
            delete i.sync_status;
            delete i.doc_number;
            delete i.return_name;
            i.list = JSON.parse(i.list);
            i.amount = i.amount.toString()
            console.log('unsyncReturn item', i);
            const resp = await SendNewReturn(token, i);
            if (resp.status === 'ok'){
                console.log('order synced');
               await deleteItem(db, 'unsyncReturns', id);
                var requests = await GetReturns(token);
                var clientsToAdd = await getAllItems(db, 'clients');
                if (requests.status === 'ok'){
                    await createTableReturns(db, 'returns');
                    await createTableReturns(db, 'todayReturns');
                    await clearTable(db, 'returns');
                    await clearTable(db, 'todayReturns');

                    let todayReturns = []
                    await requests.orders.map(i => {

                      replace(clientsToAdd,i)
                        if(i.order_date == CorrectDate(GetDate('today'))){
                            todayReturns.push(i)

                        }


                    })
                    await addNewItemsToReturns(db, 'returns', requests.orders);
                    await addNewItemsToReturns(db, 'todayReturns', todayReturns);
                    //setRefresher(!refresher);
                }
                Toast.show('Возврат синхронизирован');
                return true;
            }
            Toast.show('Возврат не синхронизирован');
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

export const replace = (clientsToAdd, order) => {
    let client = clientsToAdd.find(c => c.id == order.client_id);

    if (client) {
        order.client_name = client.name.replace(/[']+/g, "''");
    }
    else {
        order.client_name = 'noname'
    }

    if (client) {
        if (client.stores != 'null') {
            if (JSON.parse(client.stores).find(s => s.id == order.store_id))
                order.store_name = JSON.parse(client.stores).find(s => s.id == order.store_id).name.replace(/[']+/g, "''");
        }
        else {
            order.store_name = 'null';
        }
    }
    else {
        order.store_name = 'null'
    }
    order.list = order.list.replace(/[']+/g, "''");
    order.order_date = order.created_at.substring(0, 10);

}

export const replaceStores = (clientsToAdd)=>{

    let storesToAdd = [];
    clientsToAdd.map(i => {
        if (i.stores.length && i.stores != 'null'){
            i.stores = JSON.parse(i.stores);
            i.statuses = JSON.parse(i.statuses);
            var blockedSups = [];
            if (i.statuses != null && i.statuses != 'null'){
                var blocked = false;
                if (i.statuses.find(s => s.blocked == 1))
                    blocked = true;
                i.statuses.map(s => {
                    if (s.blocked == 1)
                        blockedSups.push({
                            "id": s.organization_id
                        })
                })
            }
            i.stores.map(l => {
                l.client_guid = i.guid;
                l.client_name = i.name;
                l.debt = i.total_debt;
                if (blockedSups.length)
                    l.blockedSups = blockedSups;
                if (blocked)
                    l.blocked = true;
                else
                    l.blocked = false;
                storesToAdd.push(l);
            })
        }
    })
    storesToAdd.sort(function (a, b) {
        if (a.client_name < b.client_name) {
            return -1;
        }
        if (a.client_name > b.client_name) {
            return 1;
        }
        return 0;
    })
    return storesToAdd
}
