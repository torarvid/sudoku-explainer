class MsgQ {
    constructor() {
        this.q = {}
    }
    on(msg, fn) {
        if (!this.q[msg]) {
            this.q[msg] = []
        }
        this.q[msg].push(fn)
    }

    emit(msg, data) {
        if (!this.q[msg]) {
            return
        }
        this.q[msg].forEach(fn => {
            fn(data)
        })
    }
}

export const globalQ = new MsgQ()
