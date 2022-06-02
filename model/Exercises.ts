import {
    selectFrom,
    insertInto,
    deleteFromWhere,
    updateWhere,
    selectFromWhere,
    exists,
} from '../database/SQLCommandsWrapper'
import Observable from './Observable'
import { MuscleCounter } from './MuscleCounter'
import Row from '../database/Row'
import { Muscles } from './Muscles'

export interface Exercise {
    id: number
    name: string
    ratios: MuscleCounter
}

// handles tables 'Exercises' and 'ExerciseTargetMuscles'

export class Exercises extends Observable {
    private static instance: Exercises
    private tableName: string
    private targetTableName: string

    private constructor() {
        super()
        this.tableName = 'exercises'
        this.targetTableName = 'exerciseTargetMuscles'
    }

    public static getInst() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    private async exerciseExists(exerciseName: string) {
        return await exists(
            this.tableName,
            new Row([['exerciseName', exerciseName]])
        )
    }

    public async add(exerciseName: string, exerciseRatios: MuscleCounter) {
        if (await this.exerciseExists(exerciseName)) {
            console.error('exercise already exists')
            throw new Error('exercise already exists!')
        }
        await insertInto(
            this.tableName,
            new Row([['exerciseName', exerciseName]])
        )
        let exerciseID = await this.getID(exerciseName)
        await this.insertRatios(exerciseID, exerciseRatios)
        // this.notify(): is called after inserting
    }

    private async insertRatios(exerciseID: number, ratios: MuscleCounter) {
        ratios.normalizeRatio()
        await Promise.all(
            ratios.map(async (muscleID: number, [ratio, _]) => {
                insertInto(
                    this.targetTableName,
                    new Row([
                        ['exerciseID', exerciseID],
                        ['muscleID', muscleID],
                        ['ratio', ratio],
                    ])
                )
            })
        )
        this.notify()
    }

    public async exchangeRatios(exerciseID: number, ratios: MuscleCounter) {
        await deleteFromWhere(
            this.targetTableName,
            new Row([['exerciseID', exerciseID]])
        )
        await this.insertRatios(exerciseID, ratios)
        // this.notify(): is called after inserting
    }

    private async getID(exerciseName: string) {
        let res: Row[] = await selectFromWhere(
            ['exerciseID'],
            this.tableName,
            new Row([['exerciseName =', exerciseName]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either exercise with name ${exerciseName} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        return res[0].getNumber('exerciseID')
    }

    public async deleteByID(id: number) {
        await deleteFromWhere(this.tableName, new Row([['exerciseID', id]]))
        this.notify()
    }

    public async getByID(id: number) {
        let res: Row[] = await selectFromWhere(
            ['exerciseName'],
            this.tableName,
            new Row([['exerciseID =', id]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either exercise with id ${id} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        let name = res[0].getString('exerciseName')
        let ratios = await this.getRatios(id)
        return {
            id: id,
            name: name,
            ratios: ratios,
        }
    }

    public async renameByID(id: number, newName: string) {
        await updateWhere(
            this.tableName,
            new Row([['exerciseName', newName]]),
            new Row([['exerciseID', id]])
        )
        this.notify()
    }

    public async getAllAsListItem() {
        let res: Row[] = await selectFrom(
            ['exerciseName', 'exerciseID'],
            this.tableName
        )
        let itemList = res
            .map((row: Row) => {
                return {
                    id: row.getNumber('exerciseID'),
                    name: row.getString('exerciseName'),
                    ratios: new MuscleCounter(),
                }
            })
            .map(this.exerciseToListItem)
        return itemList.sort((it1, it2) =>
            it1.content.localeCompare(it2.content)
        )
    }

    public async getExercisesTargetingMuscleAsListItem(muscleID: number) {
        let res: Row[] = await selectFromWhere(
            ['exerciseName', 'exerciseID'],
            [this.tableName, this.targetTableName].join(' NATURAL JOIN '),
            new Row([['muscleID =', muscleID]])
        )
        let itemList = res
            .map((row: Row) => {
                return {
                    id: row.getNumber('exerciseID'),
                    name: row.getString('exerciseName'),
                    ratios: new MuscleCounter(),
                }
            })
            .map(this.exerciseToListItem)
        return itemList.sort((it1, it2) =>
            it1.content.localeCompare(it2.content)
        )
    }

    private async getRatios(exerciseID: number) {
        let res: Row[] = await selectFromWhere(
            ['muscleID', 'ratio'],
            this.targetTableName,
            new Row([['exerciseID =', exerciseID]])
        )
        let ratios = new MuscleCounter()
        await Promise.all(
            res.map(async (row: Row) => {
                let muscleID = row.getNumber('muscleID')
                let { name } = await Muscles.getInst().getByID(muscleID)
                let ratio = row.getNumber('ratio')
                ratios.set(muscleID, [ratio, name])
            })
        )
        return ratios
    }

    private exerciseToListItem({ id, name }: Exercise) {
        return {
            key: id,
            content: name,
        }
    }
}
