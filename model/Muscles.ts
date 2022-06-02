import ListItem from '../components/ListItem'
import Row from '../database/Row'
import {
    selectFrom,
    insertInto,
    deleteFromWhere,
    updateWhere,
    exists,
    selectFromWhere,
} from '../database/SQLCommandsWrapper'
import Observable from './Observable'

export interface Muscle {
    id: number
    name: string
}

export class Muscles extends Observable {
    private static instance: Muscles
    private tableName: string

    private constructor() {
        super()
        this.tableName = 'muscles'
    }

    static getInst() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    private async muscleExists(muscleName: string) {
        return await exists(
            this.tableName,
            new Row([['muscleName', muscleName]])
        )
    }

    public async add(muscleName: string) {
        if (await this.muscleExists(muscleName)) {
            console.error('muscle already exists')
            throw new Error('muscle already exists!')
        }
        await insertInto(this.tableName, new Row([['muscleName', muscleName]]))
        this.notify()
    }

    public async deleteByID(id: number) {
        await deleteFromWhere(this.tableName, new Row([['muscleID', id]]))
        this.notify()
    }

    public async getID(muscleName: string) {
        let res: Row[] = await selectFromWhere(
            ['muscleID'],
            this.tableName,
            new Row([['muscleName =', muscleName]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either muscle with name ${muscleName} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        return res[0].getNumber('muscleID')
    }

    public async getByID(id: number) {
        let res: Row[] = await selectFromWhere(
            ['muscleName'],
            this.tableName,
            new Row([['muscleID =', id]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either muscle with id ${id} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        return {
            id: id,
            name: res[0].getString('muscleName'),
        }
    }

    public async renameByID(id: number, newName: string) {
        await updateWhere(
            this.tableName,
            new Row([['muscleName', newName]]),
            new Row([['muscleID', id]])
        )
        this.notify()
    }

    public async getAllAsListItem() {
        let res: Row[] = await selectFrom(
            ['muscleName', 'muscleID'],
            this.tableName
        )
        let itemList = res
            .map((row: Row) => {
                return {
                    id: row.getNumber('muscleID'),
                    name: row.getString('muscleName'),
                }
            })
            .map(this.muscleToListItem)
        return itemList.sort((it1, it2) =>
            it1.content.localeCompare(it2.content)
        )
    }

    public async isMuscleTargetedByExercise(muscleID: number) {
        return await exists(
            'exerciseTargetMuscles',
            new Row([['muscleID', muscleID]])
        )
    }

    private muscleToListItem = ({ id, name }: Muscle) => {
        return {
            key: id,
            content: name,
        }
    }

    public listItemToMuscle = ({ key, content }: ListItem) => {
        return {
            id: key,
            name: content,
        }
    }
}
