import ListItem from '../components/ListItem'
import Row from '../database/Row'
import {
    deleteFromWhere,
    exists,
    insertInto,
    selectAllFrom,
    selectFromWhere,
    updateWhere,
} from '../database/SQLCommandsWrapper'
import { Muscles } from './Muscles'
import Observable from './Observable'

export interface Split {
    id: number
    name: string
    involvedMuscles: [number, string][]
}

export class Splits extends Observable {
    private static instance: Splits
    private tableName: string
    private targetTableName: string

    private constructor() {
        super()
        this.tableName = 'splits'
        this.targetTableName = 'splitTargetMuscles'
    }

    public static getInst() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    private async nameExists(name: string) {
        return await exists(this.tableName, new Row([['splitName', name]]))
    }

    private async getIDByName(name: string) {
        if (!(await this.nameExists(name))) {
            console.error('split does not exists')
            throw new Error('split does not exists!')
        }
        let res: Row[] = await selectFromWhere(
            ['splitID'],
            this.tableName,
            new Row([['splitName =', name]])
        )
        if (res.length !== 1) {
            console.error(
                'database inconsistent, split exists multiple / no times!'
            )
            throw new Error(
                'database inconsistent, split exists multiple / no times!'
            )
        }
        return res[0].getNumber('splitID')
    }

    public async add(split: Split) {
        if (await this.nameExists(split.name)) {
            console.error('split already exists')
            throw new Error('split already exists!')
        }
        await insertInto(this.tableName, new Row([['splitName', split.name]]))
        let splitID = await this.getIDByName(split.name)
        await Promise.all(
            split.involvedMuscles.map(
                async ([muscleID]: [number, string]) =>
                    await insertInto(
                        this.targetTableName,
                        new Row([
                            ['splitID', splitID],
                            ['involvedMuscleID', muscleID],
                        ])
                    )
            )
        )
        this.notify()
    }

    public async getAllAsListItem() {
        let res: Row[] = await selectAllFrom(this.tableName)
        return res.map((row: Row) => {
            return {
                key: row.getNumber('splitID'),
                content: row.getString('splitName'),
            }
        })
    }

    public async getByID(id: number) {
        let res: Row[] = await selectFromWhere(
            ['splitName'],
            this.tableName,
            new Row([['splitID =', id]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either split with id ${id} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        let involvedMuscles = await this.getInvolvedMuscles(id)
        return {
            id: id,
            name: res[0].getString('splitName'),
            involvedMuscles: involvedMuscles,
        }
    }

    private async getInvolvedMuscles(id: number) {
        let res: Row[] = await selectFromWhere(
            ['involvedMuscleID'],
            this.targetTableName,
            new Row([['splitID =', id]])
        )
        return await Promise.all(
            res.map(async (idRow) => {
                let tuple: [number, string]
                const id = idRow.getNumber('involvedMuscleID')
                const name = (await Muscles.getInst().getByID(id)).name
                tuple = [id, name]
                return tuple
            })
        )
    }

    public async renameByID(id: number, newName: string) {
        await updateWhere(
            this.tableName,
            new Row([['splitName', newName]]),
            new Row([['splitID', id]])
        )
        this.notify()
    }

    public async deleteByID(id: number) {
        await deleteFromWhere(this.tableName, new Row([['splitID', id]]))
        this.notify()
    }

    public getInvolvedMusclesAsListItem(involvedMuscles: [number, string][]) {
        return involvedMuscles.map(([id, name]) => {
            return {
                key: id,
                content: name,
            }
        })
    }
}
