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

export function resizeEvent(): void {
    bus.emit('windows::resize')
}

export function onResizeEvent(handler: () => void): void {
    bus.on('windows::resize', handler)
}

window.addEventListener('resize', resizeEvent);
