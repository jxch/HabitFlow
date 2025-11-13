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

export function doAndOnHabitRefreshEvent(handler: () => void): void {
    handler()
    bus.on('habit::refresh', handler)
}

export function habitRefreshDateEvent(habit_id: string, date: string): void {
    bus.emit('habit::refreshDate', {habit_id: habit_id, date: date})
}

export function onHabitRefreshDateEvent(handler: (event: any) => void): void {
    bus.on('habit::refreshDate', handler)
}

export function resizeEvent(): void {
    bus.emit('windows::resize')
}

export function onResizeEvent(handler: () => void): void {
    bus.on('windows::resize', handler)
}

window.addEventListener('resize', resizeEvent);
