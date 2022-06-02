export interface Table {
    name: string
    columns: string[]
}

export const tables: Table[] = [
    // logs all available muscles
    {
        name: 'muscles',
        columns: [
            'muscleID INTEGER PRIMARY KEY AUTOINCREMENT', // PRIME key
            'muscleName TEXT',
        ],
    },
    // logs all available exercises
    {
        name: 'exercises',
        columns: [
            'exerciseID INTEGER PRIMARY KEY AUTOINCREMENT', // PRIME key
            'exerciseName TEXT',
        ],
    },
    // logs muscles which are targeted by an exercise (including the ratio)
    {
        name: 'exerciseTargetMuscles',
        columns: [
            'exerciseID INTEGER', // PRIME key
            'muscleID INTEGER', // PRIME key
            'ratio INTEGER',

            'PRIMARY KEY (exerciseID, muscleID)',
            'FOREIGN KEY (exerciseID) REFERENCES exercises(exerciseID) ON DELETE CASCADE',
            'FOREIGN KEY (muscleID) REFERENCES muscles(muscleID) ON DELETE CASCADE',
        ],
    },
    // logs all tracked workouts and if available which workoutBlueprint was executed
    // {
    //     name: 'workout',
    //     columns: [
    //         'workoutDate TEXT', // PRIME key
    //         'planID INTEGER',
    //         'microcycleNum INTEGER',
    //         'dayInMicrocycle INTEGER',

    //         'PRIMARY KEY (workoutDate)',
    //         'FOREIGN KEY (planID, microcycleNum, dayInMicrocycle) REFERENCES workoutBlueprint(planID, microcycleNum, dayInMicrocycle) ON DELETE CASCADE',
    //     ],
    // },
    // logs all available plans, how far it has been executed // and which split is used
    {
        name: 'periodizations',
        columns: [
            'periodizationID INTEGER PRIMARY KEY AUTOINCREMENT', // PRIME key, should stat
            'periodizationName TEXT',
            'active INTEGER', // boolean, at most one entry can be active
            'sessionsPerMicrocycle TEXT', // JSON array
            'rirPerMicrocycle', // JSON array: [singleMuscleExercises, multiMuscleExercises][#microcycle]
            'currentSession INTEGER',
            'completed INTEGER',

            //'FOREIGN KEY (planID, microcycleNum, dayInMicrocycle) REFERENCES workoutBlueprint(planID, microcycleNum, dayInMicrocycle) ON DELETE CASCADE',
        ],
    },
    // logs all workoutBlueprints for each given plan
    // {
    //     name: 'workoutBlueprint',
    //     columns: [
    //         'planID INTEGER NOT NULL', // PRIME key
    //         'microcycleNum INTEGER NOT NULL', // PRIME key
    //         'dayInMicrocycle INTEGER NOT NULL', // PRIME key
    //         'workoutDate TEXT',

    //         'PRIMARY KEY (planID, microcycleNum, dayInMicrocycle)',
    //         'FOREIGN KEY (workoutDate) REFERENCES workout(workoutDate) ON DELETE CASCADE',
    //     ],
    // },
    // logs all muscles involved in a workoutBlueprint
    // {
    //     name: 'workoutBlueprintMuscle',
    //     columns: [
    //         'planID INTEGER NOT NULL', // PRIME key
    //         'microcycleNum INTEGER NOT NULL', // PRIME key
    //         'dayInMicrocycle INTEGER NOT NULL', // PRIME key
    //         'muscleID INTEGER NOT NULL', // PRIME key
    //         'sets INTEGER',
    //         'rir INTEGER',

    //         'PRIMARY KEY(planID, microcycleNum, dayInMicrocycle, muscleID)',
    //         'FOREIGN KEY (planID, microcycleNum, dayInMicrocycle) REFERENCES workoutBlueprint(planID, microcycleNum, dayInMicrocycle) ON DELETE CASCADE',
    //         'FOREIGN KEY (muscleID) REFERENCES muscle(muscleID) ON DELETE CASCADE',
    //     ],
    // },
    // logs (does not enforce all) exercises involved into training a muscle in a workoutBlueprint
    // {
    //     name: 'workoutBlueprintMuscleExercise',
    //     columns: [
    //         'planID INTEGER NOT NULL', // PRIME key
    //         'microcycleNum INTEGER NOT NULL', // PRIME key
    //         'dayInMicrocycle INTEGER NOT NULL', // PRIME key
    //         'muscleID INTEGER NOT NULL', // PRIME key
    //         'exerciseID INTEGER NOT NULL', // PRIME key
    //         'sets INTEGER', // sum over all sets for one muscle <= volume

    //         'PRIMARY KEY(planID, microcycleNum, dayInMicrocycle, muscleID, exerciseID)',
    //         'FOREIGN KEY (planID, microcycleNum, dayInMicrocycle) REFERENCES workoutBlueprint(planID, microcycleNum, dayInMicrocycle) ON DELETE CASCADE',
    //         'FOREIGN KEY (muscleID) REFERENCES muscle(muscleID) ON DELETE CASCADE',
    //         'FOREIGN KEY (exerciseID) REFERENCES exercise(exerciseID) ON DELETE CASCADE',
    //     ],
    // },
    // logs all executed exercises on a day
    {
        name: 'performedExercises',
        columns: [
            'workoutDate TEXT NOT NULL', // PRIME key
            'exerciseID INTEGER NOT NULL', // PRIME key
            'sett INTEGER', // PRIME KEY
            'weight REAL',
            'reps INTEGER',
            'rir INTEGER',
            // TODO periodizationID INTEGER

            'PRIMARY KEY(workoutDate, exerciseID, sett)',
            // TODO 'FOREIGN KEY (periodizationID) REFERENCES periodzations(periodizationID) ON DELETE SET NULL',
            'FOREIGN KEY (exerciseID) REFERENCES exercises(exerciseID) ON DELETE CASCADE',
        ],
    },
    {
        name: 'splits',
        columns: [
            'splitID INTEGER PRIMARY KEY AUTOINCREMENT',
            'splitName TEXT NOT NULL',
        ],
    },
    {
        name: 'splitTargetMuscles',
        columns: [
            'splitID INTEGER',
            'involvedMuscleID INTEGER',

            'PRIMARY KEY (splitID, involvedMuscleID)',
            'FOREIGN KEY (splitID) REFERENCES splits(splitID) ON DELETE CASCADE',
            'FOREIGN KEY (involvedMuscleID) REFERENCES muscles(muscleID) ON DELETE CASCADE',
        ],
    },
]
