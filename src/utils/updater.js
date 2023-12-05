import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    GetCashOrders,
    GetCategories,
    GetClients,
    GetNomenclatures,
    GetRequests, GetReturns,
    GetSuppliers,
    GetTypesOfReturns,
    PreSync
} from "../API/api";
import Toast from "react-native-simple-toast";
import {openDatabase} from "expo-sqlite";
import {
    addNewItemsToCategories,
    addNewItemsToClients,
    addNewItemsToNomenclatures, addNewItemsToPKO, addNewItemsToRequests,
    addNewItemsToReturns,
    addNewItemsToSuppliers,
    addNewItemsToTypesOfReturns,
    clearTable,
    createTableCategories, createTableClients,
    createTableNomenclatures,
    createTablePKO, createTableRequests,
    createTableReturns,
    createTableSuppliers,
    createTableTypesOfReturns,
    createTableUnsyncPKO,
    createTableUnsyncRequests,
    createTableUnsyncReturns,
    getAllItems
} from "../db/db";
import {CorrectDate, GetDate} from "./GetDate";


export default async function updater(){
    try {
        const token = await AsyncStorage.getItem('@token');
        // const preSync = await PreSync(token);
        // console.log('preSync',preSync);
        // if (preSync.status === 'ok'){
            Toast.show('Выполняется синхронизация. Это может занять некоторое время.');
            const nomenclaturesToAdd = await GetNomenclatures(token);
            console.log('-----------------------NOMENCLATURES')

            const clientsToAdd = await GetClients(token);

            const db = openDatabase('db.db' );
            console.log('After DB connection--------------')
            const suppliers = await GetSuppliers(token);
            // console.log('GetSuppliers', suppliers);
            const categories = await GetCategories(token);
            // console.log('GetCategories', categories);
            const requests = await GetRequests(token);
            // console.log('GetRequests', requests);
            const typesOfReturns = await GetTypesOfReturns(token);
            // console.log('GetTypesOfReturns', typesOfReturns);
            const returns = await GetReturns(token);
            // console.log('GetReturns', returns);
            const pkos = await GetCashOrders(token);
            // console.log('GetCashOrders', pkos);

            await createTableTypesOfReturns(db, 'typesOfReturns');

            await createTableUnsyncRequests(db, 'unsyncReqs');

            await createTableUnsyncReturns(db, 'unsyncReturns');

            await createTableUnsyncPKO(db, 'unsyncPKO');

            if (typesOfReturns.status === 'ok'){
                await clearTable(db, 'typesOfReturns')
                if (typesOfReturns.types.length){
                    await addNewItemsToTypesOfReturns(db, 'typesOfReturns', typesOfReturns.types);
                }
            }
            if (suppliers.status === 'ok'){
                await createTableSuppliers(db, 'suppliers');
                await clearTable(db, 'suppliers');
                if (suppliers.suppliers.length){
                    await addNewItemsToSuppliers(db, 'suppliers', suppliers.suppliers);
                    // console.log('getAllItems suppliers', await getAllItems(db, 'suppliers'))
                }
                Toast.show('Поставщики добавлены');
            }
            else
                return false


            if (nomenclaturesToAdd.status === 'ok'){

                //Toast.show('Status ok');
                await createTableNomenclatures(db, 'nomenclatures');
                await clearTable(db, 'nomenclatures');

                let flagCat = false;
                if (categories.status === 'ok')
                    flagCat = true

                if (categories.categories.length){

                    await nomenclaturesToAdd.nomenclature.map((i) => {
                        if (i.balance === '')
                            i.balance = 'null';
                        else
                            i.balance = JSON.stringify(i.balance);
                        if (i.name.indexOf("'") !== -1){
                            //i.name = i.name.replaceAll("/'", "/'/'");
                            i.name = i.name.replace(/[']+/g, "''");
                        }
                        if (flagCat)
                            categories.categories.find(c => c.id === i.category_id).sup_id = i.organization_id;
                        if (i.color === '')
                            i.color === 'Default';
                        if (i.prices === '')
                            i.prices = 'null';
                        else
                            i.prices = JSON.stringify(i.prices);
                    })

                    await addNewItemsToNomenclatures(db, 'nomenclatures', nomenclaturesToAdd.nomenclature);

                    Toast.show('Номенклатуры добавлены');
                }

                if (categories.status === 'ok'){
                    await createTableCategories(db, 'categories');
                    await clearTable(db, 'categories');
                    if (categories.categories.length){
                        categories.categories.map(i => {
                            if (i.name.indexOf("'") !== -1){
                                i.name = i.name.replace(/[']+/g, "''");
                            }
                        })

                        await addNewItemsToCategories(db, 'categories', categories.categories);

                        Toast.show('Категории добавлены');
                    }
                }
                else
                    return false


            }
            else
                return false
            if (clientsToAdd.status === 'ok'){
                await createTableClients(db, 'clients');
                await clearTable(db, 'clients');

                if (clientsToAdd.clients.length){
                    clientsToAdd.clients.map(async (i) => {
                        if (i.statuses === '')
                            i.statuses = 'null';
                        else{

                            if (i.statuses.indexOf("'") !== -1){
                                //i.name = i.name.replaceAll("/'", "/'/'");
                                i.statuses = i.statuses.replace(/[']+/g, "''");
                            }
                            i.statuses = JSON.stringify(i.statuses);
                        }

                        for (let key in i) {
                            if (JSON.stringify(i[key]).indexOf("'") !== -1)
                                i[key] = JSON.parse(JSON.stringify(i[key]).replace(/[']+/g, "''"));
                        }
                        if (i.stores === '')
                            i.stores = 'null';
                        else
                            i.stores = JSON.stringify(i.stores);

                    })


                    await  addNewItemsToClients(db, 'clients', clientsToAdd.clients);


                    Toast.show('Контрагенты добавлены');
                }
            }
            else
                return false



            if (returns.status === 'ok'){
                await createTableReturns(db, 'returns');
                await createTableReturns(db, 'todayReturns');
                await clearTable(db, 'returns');
                await clearTable(db, 'todayReturns');

                if (returns.orders.length > 0){
                    await returns.orders.map(i => {
                        var client = clientsToAdd.clients.find(c => c.id === i.client_id);
                        if (client)
                            i.client_name = client.name.replace(/[']+/g, "''");
                        else
                            i.client_name = 'noname'

                        if (client)
                            if (client.stores !== 'null')
                                if (JSON.parse(client.stores).find(s => s.id === i.store_id))
                                    i.store_name = JSON.parse(client.stores).find(s => s.id === i.store_id).name.replace(/[']+/g, "''");
                                else
                                    i.store_name = 'null';
                            else
                                i.store_name = 'null'
                        i.list = i.list.replace(/[']+/g, "''");

                        i.order_date = i.created_at.substring(0, 10);
                    })

                    await addNewItemsToReturns(db, 'returns', returns.orders);

                    const todayReturns =  returns.orders.filter(i => i.order_date == CorrectDate(GetDate('today')))
                    await addNewItemsToReturns(db, 'todayReturns', todayReturns);
                }
            }
            else
                return false

            if (pkos.status === 'ok'){
                await createTablePKO(db, 'pko');
                await createTablePKO(db, 'todayPko');
                await clearTable(db, 'pko');
                await clearTable(db, 'todayPko');

                if (pkos.cash_order_receipts.length > 0){
                    await pkos.cash_order_receipts.map(i => {
                        var client = clientsToAdd.clients.find(c => c.id === i.client_id);
                        var supplier = suppliers.suppliers.find(s => s.id === i.organization_id);
                        if (client)
                            i.client_name = client.name.replace(/[']+/g, "''");
                        else
                            i.client_name = 'noname'
                        if (client)
                            if (client.stores !== 'null')
                                if (JSON.parse(client.stores).find(s => s.id === i.store_id))
                                    i.store_name = JSON.parse(client.stores).find(s => s.id === i.store_id).name.replace(/[']+/g, "''");
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

                    await addNewItemsToPKO(db, 'pko', pkos.cash_order_receipts);
                    const todayPko =  pkos.cash_order_receipts.filter(i => i.order_date == CorrectDate(GetDate('today')))
                    await addNewItemsToPKO(db, 'todayPko', todayPko);
                }
            }
            else
                return false

            if (requests.status === 'ok'){
                await createTableRequests(db, 'requests');
                await createTableRequests(db, 'todayRequests');
                await clearTable(db, 'requests');
                await clearTable(db, 'todayRequests');
                if (requests.orders.length > 0){
                    await requests.orders.map(i => {
                        var client = clientsToAdd.clients.find(c => c.id === i.client_id);
                        if (client)
                            i.client_name = client.name.replace(/[']+/g, "''");
                        else
                            i.client_name = 'noname'
                        //console.log(JSON.parse(client.stores).find(s => s.id == i.store_id))
                        if (client)
                            if (client.stores !== 'null')
                                if (JSON.parse(client.stores).find(s => s.id === i.store_id))
                                    i.store_name = JSON.parse(client.stores).find(s => s.id === i.store_id).name.replace(/[']+/g, "''");
                                else
                                    i.store_name = 'null';
                            else
                                i.store_name = 'null'
                        i.list = i.list.replace(/[']+/g, "''");
                        i.order_date = i.created_at.substring(0, 10);
                    })
                    await addNewItemsToRequests(db, 'requests', requests.orders);
                    const todayOrders =  requests.orders.filter(i => i.order_date == CorrectDate(GetDate('today')))
                    await addNewItemsToRequests(db, 'todayRequests', todayOrders);
                    console.log('addNewItemsToRequests todayRequests', todayOrders)
                    Toast.show('Заявки добавлены');
                }
            }
            else
                return false
            //const items = await getAllItems(db, 'nomenclatures')
            //console.log(items);
            return true;
        // }
    } catch (e) {
        console.log(e.message)
    }

}
