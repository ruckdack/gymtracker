import { createTable, getAllTableNames } from './SQLCommandsWrapper'
import { tables } from './Tables'
import { Exercises } from '../model/Exercises'
import { Muscles } from '../model/Muscles'
import { MuscleCounter } from '../model/MuscleCounter'

export const initTablesWithData = async () => {
    const firstLaunch = (await getAllTableNames()).length === 0
    for (let table of tables) {
        await createTable(table.name, table.columns)
    }
    if (firstLaunch) {
        loadInitialData()
    }
}

const loadInitialData = async () => {
    await Muscles.getInst().add('chest')
    await Muscles.getInst().add('lat')
    await Muscles.getInst().add('delts')
    await Muscles.getInst().add('rear delts')
    await Muscles.getInst().add('trapez/rhomboids')
    await Muscles.getInst().add('back extensor')
    await Muscles.getInst().add('bizeps')
    await Muscles.getInst().add('trizeps')
    await Muscles.getInst().add('glute')
    await Muscles.getInst().add('quads')
    await Muscles.getInst().add('hamstrings')
    await Muscles.getInst().add('calves')
    await Muscles.getInst().add('abs')

    // await Exercises.getInst().add('benchpress', new MuscleCounter())
    // await Exercises.getInst().addRatiosToExercise('benchpress', [
    //     ['chest', 2],
    //     ['trizeps', 1],
    // ])
    // await Exercises.getInst().add('flies', new MuscleCounter())
    // await Exercises.getInst().addRatiosToExercise('flies', [['chest', 1]])
    // await Exercises.getInst().add('squats', new MuscleCounter())
    // await Exercises.getInst().addRatiosToExercise('squats', [
    //     ['quads', 4],
    //     ['glute', 4],
    //     ['hamstrings', 2],
    //     ['back extensor', 1],
    // ])

    // await Exercises.getInst().add('brustpresse', new Ratios())
    // await Exercises.getInst().add('bizepscurl', new Ratios())
    // await Exercises.getInst().add('trizepsstrecken', new Ratios())
    // await Exercises.getInst().add('rudern', new Ratios())
    // await Exercises.getInst().add('latzug', new Ratios())
    // await Exercises.getInst().add('reverse butterfly', new Ratios())
    // await Exercises.getInst().add('butterfly', new Ratios())
    // await Exercises.getInst().add('wadenheben', new Ratios())
    // await Exercises.getInst().add('kreuzheben', new Ratios())
    // await Exercises.getInst().add('seitheben', new Ratios())
    // await Exercises.getInst().add('kurzhantel bankdrücken', new Ratios())
    // await Exercises.getInst().add('seitheben maschine', new Ratios())
    // await Exercises.getInst().add('rumänisches kreuzheben', new Ratios())
    // await Exercises.getInst().add('bulgarian split squats', new Ratios())
    // await Exercises.getInst().add('crunches', new Ratios())
}
