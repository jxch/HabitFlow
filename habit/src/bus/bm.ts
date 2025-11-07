import {bus} from './bus';

export function userLoginEvent(): void {
    bus.emit('user::login')
}

export function onUserLoginEvent(handler: () => void): void {
    bus.on('user::login', handler)
}

export function habitRefreshEvent(): void {
    bus.emit('habit::refresh')
}

export function onHabitRefreshEvent(handler: () => void): void {
    bus.on('habit::refresh', handler)
}

export function habitClockEvent(): void {
    bus.emit('habit::clock')
}

export function onHabitClockEvent(handler: () => void): void {
    bus.on('habit::clock', handler)
}

