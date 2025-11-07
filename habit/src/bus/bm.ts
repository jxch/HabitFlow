import {bus} from './bus';

export function habitRefreshEvent(): void {
    bus.emit('habit::refresh')
}

export function onHabitRefreshEvent(handler: () => void): void {
    bus.on('habit::refresh', handler)
}

