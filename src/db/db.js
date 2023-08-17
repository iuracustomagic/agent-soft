import { openDatabase } from 'expo-sqlite';


export const getDBConnection = async () => {
  return openDatabase('db.db');
};

export const createTableNomenclatures = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, name TEXT, 
category_id, organization_id, price, unit, coef, balance, color);`;
  await db.transaction(tx => {
  tx.executeSql(query)
})

};
export const createTableClients = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, name TEXT, 
 idno NULL, juridical_address TEXT NULL, total_debt NULL, statuses NULL, stores NULL
                 );`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableSuppliers = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, name TEXT);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableCategories = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, name TEXT, sup_id);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableRequests = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, agent_id, agent_guid
    client_id, client_guid, client_name TEXT, store_id, store_guid TEXT, store_name TEXT,
    order_date, delivery_date, amount, list, sync_status, check_required, doc_type, exported, print_cert, promo,
    comment TEXT
                 );`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableUnsyncRequests = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, client_id, client_guid TEXT, client_name TEXT, 
store_id, store_guid TEXT, store_name TEXT, order_date, delivery_date, amount, list, sync_status, 
check_required, doc_type, exported, print_cert, promo, comment TEXT);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableTypesOfReturns = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, name TEXT);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableReturns = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid TEXT, agent_id INTEGER, 
agent_guid INTEGER, client_id INTEGER, client_guid TEXT, client_name TEXT, store_id INTEGER, store_guid TEXT, store_name TEXT,
amount INTEGER, list TEXT, sync_status INTEGER, order_date DATE, doc_type INTEGER, exported DATE, comment TEXT);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableUnsyncReturns = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, client_id INTEGER, client_guid INTEGER,
 client_name TEXT, store_id INTEGER, store_guid INTEGER, store_name TEXT,amount INTEGER, list TEXT, sync_status INTEGER, 
 order_date DATE, doc_type INTEGER, exported DATE, comment TEXT);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTablePKO = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, guid, client_id, client_guid TEXT,
    client_name TEXT, supplier_id, supplier_guid,
    supplier_name TEXT, store_id, store_guid TEXT, store_name TEXT,
    amount, comment TEXT, sync_status, order_date, doc_type, exported);`;
  await db.transaction(tx => {
    tx.executeSql(query)
  })
};
export const createTableUnsyncPKO = async (db, tname) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tname} (id INTEGER PRIMARY KEY, client_id, client_guid TEXT,
    client_name TEXT, supplier_id, supplier_guid TEXT,
    supplier_name TEXT, store_id, store_guid TEXT, store_name TEXT,
    amount, comment TEXT, sync_status, order_date, doc_type, exported);`;

   await db.transaction(tx => {
  tx.executeSql(query)
})
};

export const getAllItems = async (db, tname) => {
  try {
    const items = [];
    const query = `SELECT * FROM ${tname}`;
    const results =  await db.transaction(tx => {
      tx.executeSql(query)
    });
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index))
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items');
  }
};

export const addNewItemsToClients = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, name, idno, juridical_address, total_debt, statuses, stores) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', '${i.name}',' ${i.idno}', '${i.juridical_address}', ${i.total_debt}, '${i.statuses}', '${i.stores}')`).join(',');
  return  db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const addNewItemsToSuppliers = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, name) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', '${i.name}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const addNewItemsToCategories = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, name, sup_id) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', '${i.name}', ${i.sup_id})`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};
export const addNewItemsToRequests = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, agent_id, agent_guid, client_id, client_guid, client_name,
                                        store_id, store_guid, store_name,
                                        order_date, delivery_date, amount, list, sync_status, check_required, doc_type, exported, print_cert, promo,
                                        comment) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', ${i.agent_id}, '${i.agent_guid}', ${i.client_id}, 
    '${i.client_guid}', '${i.client_name}', ${i.store_id}, '${i.store_guid}', '${i.store_name}', '${i.order_date}',
    '${i.delivery_date}', ${i.amount}, '${i.list}', ${i.sync_status}, ${i.check_required},
    ${i.doc_type}, ${i.exported}, ${i.print_cert}, ${i.promo}, '${i.comment}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};
export const addNewItemsToReturns = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, agent_id, agent_guid, client_id, client_guid, client_name,
                                        store_id, store_guid, store_name, amount, list, sync_status, order_date, doc_type, exported, comment) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', ${i.agent_id}, '${i.agent_guid}', ${i.client_id}, 
    '${i.client_guid}', '${i.client_name}', ${i.store_id}, '${i.store_guid}', '${i.store_name}', ${i.amount}, '${i.list}', ${i.sync_status}, '${i.order_date}',
    ${i.doc_type}, ${i.exported}, '${i.comment}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};
export const addNewItemsToUnsyncReturns = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (client_id, client_guid, client_name,
                                        store_id, store_guid, store_name, amount, list, sync_status, order_date, doc_type, exported, comment) values` +
      insertArray.map(i => `( ${i.client_id}, 
    '${i.client_guid}', '${i.client_name}', ${i.store_id}, '${i.store_guid}', '${i.store_name}', ${i.amount}, '${i.list}', ${i.sync_status}, '${i.order_date}',
    ${i.doc_type}, ${i.exported}, '${i.comment}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const addNewItemsToUnsyncRequests = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (client_id, client_guid, client_name,
                                        store_id, store_guid, store_name,
                                        order_date, delivery_date, amount, list, sync_status,
                                        check_required, doc_type, exported, print_cert, promo, comment) values` +
      insertArray.map(i => `(${i.client_id}, 
    '${i.client_guid}', '${i.client_name}', ${i.store_id}, '${i.store_guid}', '${i.store_name}', '${i.order_date}',
    '${i.delivery_date}', ${i.amount}, '${i.list}', ${i.sync_status}, ${i.check_required},
    ${i.doc_type}, ${i.exported}, ${i.print_cert}, ${i.promo}, '${i.comment}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const addNewItemsToTypesOfReturns = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, name) values` +
      insertArray.map(i => `(${i.id}, 
    '${i.guid}', '${i.name}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};
export const addNewItemsToPKO = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (
        id, guid, client_id, client_guid,
        client_name, supplier_id, supplier_guid,
        supplier_name, store_id, store_guid, store_name,
        amount, comment, sync_status, order_date, doc_type, exported
      ) values` +
      insertArray.map(i => `(
      ${i.id}, '${i.guid}', ${i.client_id}, '${i.client_guid}',
      '${i.client_name}', ${i.supplier_id},
      '${i.supplier_guid}', '${i.supplier_name}', ${i.store_id}, 
      '${i.store_guid}', '${i.store_name}', ${i.amount}, '${i.comment}',
      ${i.sync_status}, '${i.order_date}', ${i.doc_type}, ${i.exported}
    )`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};
export const addNewItemsToUnsyncPKO = async (db, tname, insertArray) => {
  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (
        client_id, client_guid,
        client_name, supplier_id, supplier_guid,
        supplier_name, store_id, store_guid, store_name,
        amount, comment, sync_status, order_date, doc_type, exported
      ) values` +
      insertArray.map(i => `(
      ${i.client_id}, '${i.client_guid}',
      '${i.client_name}', ${i.supplier_id},
      '${i.supplier_guid}', '${i.supplier_name}', ${i.store_id}, 
      '${i.store_guid}', '${i.store_name}', ${i.amount}, '${i.comment}',
      ${i.sync_status}, '${i.order_date}', ${i.doc_type}, ${i.exported}
    )`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const addNewItemsToNomenclatures = async (db, tname, insertArray) => {

  const insertQuery =
      `INSERT OR REPLACE INTO ${tname} (id, guid, name, category_id, organization_id, price, unit, coef, balance, color) values` +
      insertArray.map(i => `(${i.id}, '${i.guid}', '${i.name}', ${i.category_id}, ${i.organization_id}, '${i.prices}', '${i.unit}', ${i.coef}, '${i.balance}', '${i.color}')`).join(',');
  return db.transaction(tx => {
    tx.executeSql(insertQuery)
  });
};

export const deleteItem = async (db, tname, id: number) => {
  const deleteQuery = `DELETE from ${tname} where id = ${id}`;
  await db.transaction(tx => {
    tx.executeSql(deleteQuery)
  })
};

export const deleteTable = async (db, tname) => {
  const query = `drop table ${tname}`;

   await db.transaction(tx => {
  tx.executeSql(query)
})
};

export const clearTable = async (db, tname) => {
  const deleteQuery = `DELETE from ${tname}`;
  await db.transaction(tx => {
    tx.executeSql(deleteQuery)
  })

}

export const checkTableExist = async (db, tname) => {

  const checkQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tname}'`;
  await db.transaction(tx => {
    tx.executeSql(checkQuery)
  })

}
