import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'makaan-admin-session-v1'
const listeners = new Set()

const DEFAULT = {
  signedIn: false,
  name: 'Makaan Admin',
  email: 'admin@makaan.pk',
}

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT }
    return { ...DEFAULT, ...parsed }
  } catch {
    return { ...DEFAULT }
  }
}

function write(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(DEFAULT)
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function getSession() {
  return read()
}

export function signInAdmin(patch = {}) {
  write({ ...DEFAULT, signedIn: true, ...patch })
}

export function signOutAdmin() {
  write({ ...DEFAULT, signedIn: false })
}

export function useAdminSession() {
  useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(DEFAULT))
  return read()
}
