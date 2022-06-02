import Row from '../database/Row'
import {
    exists,
    insertInto,
    selectAllFromWhere,
    selectFrom,
    updateWhere,
} from '../database/SQLCommandsWrapper'
import { MuscleCounter } from './MuscleCounter'
import Observable from './Observable'

export interface Periodization {
    id: number
    name: string
    active: boolean
    sessionsPerMicrocycle: number[]
    rirPerMicrocycle: [number, number][] // tuple: [singleMuscleExercises,multieMuscleExercises]
    currentSession: number
    completed: boolean
}

export interface Microcycle {
    sets: MuscleCounter
    singleMuscleExerciseRir: number
    multiMuscleExerciseRir: number
}

export class Periodizations extends Observable {
    private static instance: Periodizations
    private tableName = 'periodizations'

    private constructor() {
        super()
    }

    public static getInst() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    private async periodizationExists(periodizationName: string) {
        return await exists(
            this.tableName,
            new Row([['periodizationName', periodizationName]])
        )
    }

    public async add(p: Periodization) {
        if (await this.periodizationExists(p.name)) {
            console.error('periodization already exists')
            throw new Error('periodization already exists!')
        }
        await insertInto(
            this.tableName,
            new Row([
                ['periodizationName', p.name],
                ['active', p.active ? 1 : 0],
                [
                    'sessionsPerMicrocycle',
                    JSON.stringify(p.sessionsPerMicrocycle),
                ],
                ['rirPerMicrocycle', JSON.stringify(p.rirPerMicrocycle)],
                ['currentSession', p.currentSession],
                ['completed', p.completed ? 1 : 0],
            ])
        )
    }

    public async getAllAsListItem() {
        let res: Row[] = await selectFrom(
            ['periodizationID', 'periodizationName'],
            this.tableName
        )
        return res.map((row: Row) => {
            return {
                key: row.getNumber('periodizationID'),
                content: row.getString('periodizationName'),
            }
        })
    }

    private rowToPeriodization(row: Row) {
        const periodization: Periodization = {
            id: row.getNumber('periodizationID'),
            name: row.getString('periodizationName'),
            active: row.getNumber('active') === 1 ? true : false,
            sessionsPerMicrocycle: JSON.parse(
                row.getString('sessionsPerMicrocycle')
            ),
            rirPerMicrocycle: JSON.parse(row.getString('rirPerMicrocycle')),
            currentSession: row.getNumber('currentSession'),
            completed: row.getNumber('completed') === 1 ? true : false,
        }
        return periodization
    }

    private async getByID(id: number) {
        let res: Row[] = await selectAllFromWhere(
            this.tableName,
            new Row([['periodizationID', id]])
        )
        if (res.length !== 1) {
            console.error(
                `inconsistency in db, either periodization with id ${id} does not exist or exists mutliple times`
            )
            throw new Error('database error')
        }
        return this.rowToPeriodization(res[0])
    }

    public async getActive() {
        let res: Row[] = await selectAllFromWhere(
            this.tableName,
            new Row([['active', 1]])
        )
        if (res.length > 1) {
            console.error(
                `inconsistency in db, active periodization exists mutliple times`
            )
            throw new Error('database error')
        }
        if (res.length === 0) {
            return null
        }
        return this.rowToPeriodization(res[0])
    }

    private async deactivate(id: number) {
        await updateWhere(
            this.tableName,
            new Row([['active', 0]]),
            new Row([['periodizationID', id]])
        )
    }

    public async activate(id: number) {
        let currentActive = await this.getActive()
        if (currentActive) {
            await this.deactivate(currentActive.id)
        }
        await updateWhere(
            this.tableName,
            new Row([['active', 1]]),
            new Row([['periodizationID', id]])
        )
    }
}
