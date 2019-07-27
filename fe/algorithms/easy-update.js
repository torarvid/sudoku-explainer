
export class AlgEasyUpdate {
    run(state, { helper }) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!(helper.get(i, j).length === 1)) {
                    continue
                }
                state.updated = true
                state.row = i
                state.col = j
                state.value = helper.get(i, j)[0]
                state.reason = `(${i+1},${j+1}) set to ${state.value}, only possible value`
                return state
            }
        }
    }
}
