interface IFunc {
    func: Function,
    ctx: unknown
}

// 事件中心（发布订阅模式）
class EventManager {
    private eventDic: Map<string, Array<IFunc>> = new Map()

    on(eventName: string, func: Function, ctx?: unknown) {
        if (this.eventDic.has(eventName)) {
            this.eventDic.get(eventName).push({ func, ctx })
        } else {
            this.eventDic.set(eventName, [{ func, ctx }])
        }
    }

    off(eventName: string, func: Function) {
        if (this.eventDic.has(eventName)) {
            const funcList = this.eventDic.get(eventName)
            const inx = funcList.findIndex(i => i.func === func)
            inx > -1 && funcList.splice(inx, 1)
        }
    }

    emit(eventName: string, ...params: unknown[]) {
        if (this.eventDic.has(eventName)) {
            this.eventDic.get(eventName).forEach(item => {
                item.ctx ? item.func.apply(item.ctx, params) : item.func(...params)
            })
        }
    }

    clear() {
        this.eventDic.clear()
    }
}

export default new EventManager()