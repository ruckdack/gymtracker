import _ from 'underscore'
import Row from '../database/Row'
import {
    deleteFromWhere,
    exists,
    insertInto,
    selectFrom,
    selectFromWhere,
    selectFromWhereOrderBy,
} from '../database/SQLCommandsWrapper'
import { Exercise, Exercises } from './Exercises'
import Observable from './Observable'

export interface PerformedExercise {
    workoutDate: string
    exercise: Exercise
    sets: Set[]
}

export interface Set {
    weight: number
    reps: number
    rir: number
}

export class PerformedExercises extends Observable {
    private static instance: PerformedExercises
    private tableName: string

    private constructor() {
        super()
        this.tableName = 'performedExercises'
    }

    static getInst() {
        if (!this.instance) {
            this.instance = new PerformedExercises()
        }
        return this.instance
    }

    // does an execution of an exercise exits for the given date?
    private async executionExists(e: PerformedExercise) {
        return await exists(
            this.tableName,
            new Row([
                ['workoutDate', e.workoutDate],
                ['exerciseID', e.exercise.id],
            ])
        )
    }

    // does an exercise execution exist in general?
    public async exerciseExecuted(exerciseID: number) {
        return await exists(
            this.tableName,
            new Row([['exerciseID', exerciseID]])
        )
    }

    private async getAmountOfSets(date: string, exerciseID: number) {
        // this may cause an error if the database does not maintain consistency in terms of the set counter
        let res = await selectFromWhere(
            ['sett'],
            this.tableName,
            new Row([
                ['workoutDate =', date],
                ['exerciseID =', exerciseID],
            ])
        )
        return res.length === 0
            ? 0
            : Math.max(...res.map((row: Row) => row.getNumber('sett'))) + 1
    }

    public async getVolumeByDate(date: string) {
        let res = await selectFromWhere(
            ['workoutDate'],
            this.tableName,
            new Row([['workoutDate =', date]])
        )
        return res.length
    }

    public async getPerMuscleVolumeByDate(date: string) {
        let res = await selectFromWhere(
            ['exerciseID'],
            this.tableName,
            new Row([['workoutDate =', date]])
        )
        let performedExerciseIDs = _.uniq(
            res.map((row) => row.getNumber('exerciseID'))
        )
        let setsPerMuscle = new Map<number, [number, string]>()
        for (let id of performedExerciseIDs) {
            let sets = await this.getAmountOfSets(date, id)
            let ratios = (await Exercises.getInst().getByID(id)).ratios
            let ratioSum = ratios.getCountersSum()
            for (let [muscleID, [ratio, muscleName]] of ratios) {
                let [oldVal, _] = setsPerMuscle.get(muscleID) ?? [0, '']
                setsPerMuscle.set(muscleID, [
                    oldVal + (sets * ratio) / ratioSum,
                    muscleName,
                ])
            }
        }
        return setsPerMuscle
    }

    public async add(e: PerformedExercise) {
        // set refers to a workout set
        let setCounter = 0
        if (await this.executionExists(e)) {
            setCounter = await this.getAmountOfSets(
                e.workoutDate,
                e.exercise.id
            )
        }
        for (let set of e.sets) {
            await insertInto(
                this.tableName,
                new Row([
                    ['workoutDate', e.workoutDate],
                    ['exerciseID', e.exercise.id],
                    ['sett', setCounter],
                    ['weight', set.weight],
                    ['reps', set.reps],
                    ['rir', set.rir],
                ])
            )
            setCounter++
        }
        this.notify()
    }

    public async exchangeByDateAndExerciseID(e: PerformedExercise) {
        await deleteFromWhere(
            this.tableName,
            new Row([
                ['workoutDate', e.workoutDate],
                ['exerciseID', e.exercise.id],
            ])
        )
        this.add(e)
    }

    public async getByDateAndExerciseID(
        workoutDate: string,
        exerciseID: number
    ) {
        let res = await selectFromWhere(
            ['sett', 'weight', 'rir', 'reps'],
            this.tableName,
            new Row([
                ['workoutDate =', workoutDate],
                ['exerciseID =', exerciseID],
            ])
        )
        let sets: Set[] = []
        for (let row of res) {
            sets[row.getNumber('sett')] = {
                weight: row.getNumber('weight'),
                reps: row.getNumber('reps'),
                rir: row.getNumber('rir'),
            }
        }
        return {
            workoutDate: workoutDate,
            exercise: await Exercises.getInst().getByID(exerciseID),
            sets: sets,
        }
    }

    public async deleteByDateAndExerciseID(
        workoutDate: string,
        exerciseID: number
    ) {
        await deleteFromWhere(
            this.tableName,
            new Row([
                ['workoutDate', workoutDate],
                ['exerciseID', exerciseID],
            ])
        )
        this.notify()
    }

    public async getAllWorkoutDates() {
        let res = await selectFrom(['workoutDate'], this.tableName)
        let datesWithDups = res.map((row: Row) => row.getString('workoutDate'))
        return _.uniq(datesWithDups)
    }

    public async getByDate(workoutDate: string) {
        let res = await selectFromWhere(
            ['exerciseID', 'sett', 'weight', 'rir', 'reps'],
            this.tableName,
            new Row([['workoutDate =', workoutDate]])
        )
        let map = new Map<number, Set[]>()
        for (let row of res) {
            let exerciseID = row.getNumber('exerciseID')
            let sets = map.get(exerciseID) ?? []
            sets[row.getNumber('sett')] = {
                weight: row.getNumber('weight'),
                reps: row.getNumber('reps'),
                rir: row.getNumber('rir'),
            }
            map.set(exerciseID, sets)
        }
        let executions: PerformedExercise[] = []
        for (let [exerciseID, sets] of map) {
            let exercise = await Exercises.getInst().getByID(exerciseID)
            executions.push({
                workoutDate: workoutDate,
                exercise: exercise,
                sets: sets,
            })
        }
        // simple reversion might cause performance issues
        return executions.reverse()
    }

    public async getAllByExerciseID(exerciseID: number) {
        return await this.getByExerciseID(exerciseID, 'A')
    }

    public async getByExerciseID(exerciseID: number, pastDate: string) {
        let res = await selectFromWhereOrderBy(
            ['workoutDate', 'sett', 'weight', 'rir', 'reps'],
            this.tableName,
            new Row([
                ['exerciseID =', exerciseID],
                ['workoutDate <', pastDate],
            ]),
            'workoutDate DESC'
        )
        let map = new Map<string, Set[]>()
        for (let row of res) {
            let workoutDate = row.getString('workoutDate')
            let sets = map.get(workoutDate) ?? []
            sets[row.getNumber('sett')] = {
                weight: row.getNumber('weight'),
                reps: row.getNumber('reps'),
                rir: row.getNumber('rir'),
            }
            map.set(workoutDate, sets)
        }
        let executions: PerformedExercise[] = []
        let exercise = await Exercises.getInst().getByID(exerciseID)
        for (let [workoutDate, sets] of map) {
            executions.push({
                workoutDate: workoutDate,
                exercise: exercise,
                sets: sets,
            })
        }
        return executions
    }
}
