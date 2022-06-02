import SQLite from 'react-native-sqlite-storage'
import Row from './Row'

const databaseName = 'sqlite.db'
var database: SQLite.SQLiteDatabase | undefined

const stringifyRow = (row: Row) => {
    const newRow: Row = new Row()
    row.forEach((value, key) => {
        typeof value === 'number'
            ? newRow.set(key, `${value}`)
            : newRow.set(key, `'${value}'`)
    })
    return newRow
}

export const createTable = async (name: string, columns: string[]) => {
    executeQuery(`CREATE TABLE IF NOT EXISTS ${name} (${columns.join(', ')})`)
}

export const insertInto = async (table: string, rawRow: Row) => {
    const row: Row = stringifyRow(rawRow)
    executeQuery(
        `INSERT INTO ${table} (${Array.from(row.keys()).join(
            ', '
        )}) VALUES (${Array.from(row.values()).join(', ')})`
    )
}

export const exists = async (table: string, rawRow: Row) => {
    const row: Row = stringifyRow(rawRow)
    const res: Row[] = await executeQuery(
        `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${Array.from(row)
            .map(([key, value]) => `${key} = ${value}`)
            .join(' AND ')})`
    )
    return Array.from(res[0].values())[0] === 1
}

export const updateWhere = async (
    table: string,
    rawNewRow: Row,
    rawKeyRow: Row
) => {
    const newRow: Row = stringifyRow(rawNewRow)
    const keyRow: Row = stringifyRow(rawKeyRow)
    executeQuery(
        `UPDATE ${table} SET ${Array.from(newRow)
            .map(([key, value]) => `${key} = ${value}`)
            .join(', ')} WHERE ${Array.from(keyRow)
            .map(([key, value]) => `${key} = ${value}`)
            .join(' AND ')}`
    )
}

export const deleteFromWhere = async (table: string, rawRow: Row) => {
    const row: Row = stringifyRow(rawRow)
    executeQuery(
        `DELETE FROM ${table} WHERE ${Array.from(row)
            .map(([key, value]) => `${key} = ${value}`)
            .join(' AND ')}`
    )
}

export const clearDatabase = async () => {
    const allTables: string[] = await getAllTableNames()
    setForeignKeys('OFF')
    await Promise.all(allTables.map(async (table: string) => dropTable(table)))
    setForeignKeys('ON')
}

export const dropTable = async (name: string) => {
    executeQuery(`DROP TABLE IF EXISTS ${name}`)
}

export const selectAllFrom = async (from: string) => {
    return selectFrom(['*'], from)
}

export const selectFrom = async (select: string[], from: string) => {
    const res: Row[] = await executeQuery(
        `SELECT ${select.join(', ')} FROM ${from}`
    )
    return res
}

const convertResultSetToRowArray: (res: SQLite.ResultSet) => Row[] = (res) => {
    const mapSQLRowToRow: (row: SQLite.ResultSetRowList) => Row = (inRow) => {
        let outRow = new Row()
        Object.entries(inRow).forEach(([prop, value]) => {
            outRow.set(prop, value)
        })
        return outRow
    }
    return res.rows
        .raw()
        .map((row: SQLite.ResultSetRowList) => mapSQLRowToRow(row))
}

export const selectAllFromWhere = async (from: string, whereRaw: Row) =>
    selectFromWhere(['*'], from, whereRaw)

export const selectFromWhere = async (
    select: string[],
    from: string,
    whereRaw: Row
) => {
    const where: Row = stringifyRow(whereRaw)
    const res: Row[] = await executeQuery(
        `SELECT ${select.join(', ')} FROM ${from} WHERE ${Array.from(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(' AND ')}`
    )
    return res
}

export const selectFromWhereOrderBy = async (
    select: string[],
    from: string,
    whereRaw: Row,
    orderBy: string
) => {
    const where: Row = stringifyRow(whereRaw)
    const res: Row[] = await executeQuery(
        `SELECT ${select.join(', ')} FROM ${from} WHERE ${Array.from(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(' AND ')} ORDER BY ${orderBy}`
    )
    return res
}

export const getAllTableNames = async () => {
    const res: Row[] = await executeQuery(
        `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'ANDROID_METADATA'`
    )
    return res.map((row) => row.getString('name'))
}

// TODO do not export
export const executeQuery: (query: string) => Promise<Row[]> = (query) =>
    new Promise<Row[]>(async (resolve, reject) => {
        let databaseError = new Error('Database Error')
        if (!database) {
            await openDatabase()
        }
        database!.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (_, res) => {
                    console.debug(
                        `\nexecuted query: ${query}\nresults: ${resultSetToString(
                            res
                        )}`
                    )
                    resolve(convertResultSetToRowArray(res))
                },
                (err) => {
                    console.error(err)
                    reject(databaseError)
                }
            )
        })
    })

const openDatabase = async () => {
    database = await SQLite.openDatabase({
        name: databaseName,
        location: 'default',
    })
    setForeignKeys('ON')
}

const setForeignKeys = async (state: 'ON' | 'OFF') => {
    if (!database) {
        await openDatabase()
    }
    database!.executeSql(
        `PRAGMA foreign_keys = ${state}`,
        [],
        (_) => undefined,
        (err) => console.error(err)
    )
}

// TODO do not export
const resultSetToString: (res: SQLite.ResultSet) => string = (res) => {
    return res.rows
        .raw()
        .map((row) => JSON.stringify(row))
        .join('\n')
}
