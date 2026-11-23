import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'makaan-admin-session-v1'
const listeners = new Set()

const EMPTY_ADMIN = {
  _id: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  businessOpensAt: '',
  businessCloseAt: '',
  modifiedOn: '',
}

const DEFAULT = {
  signedIn: false,
  name: '',
  email: '',
  accessToken: '',
  expiresIn: '',
  admin: { ...EMPTY_ADMIN },
}

function normalizeAdmin(admin = {}) {
  return {
    _id: admin._id || '',
    name: (admin.name || '').trim(),
    email: (admin.email || '').trim(),
    phone: (admin.phone || '').trim(),
    location: (admin.location || '').trim(),
    businessOpensAt: (admin.businessOpensAt || '').trim(),
    businessCloseAt: (
      admin.businessCloseAt ||
      admin.businessClosesAt ||
      ''
    ).trim(),
    modifiedOn: admin.modifiedOn || '',
  }
}

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT, admin: { ...EMPTY_ADMIN } }
    }
    const admin = normalizeAdmin(parsed.admin || parsed)
    return {
      ...DEFAULT,
      ...parsed,
      name: admin.name || parsed.name || '',
      email: admin.email || parsed.email || '',
      admin,
    }
  } catch {
    return { ...DEFAULT, admin: { ...EMPTY_ADMIN } }
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

export function displayOrDash(value, fallback = '--') {
  const text = (value ?? '').toString().trim()
  return text || fallback
}

export function getSession() {
  return read()
}

export function getAccessToken() {
  return read().accessToken || ''
}

export function getSessionAdmin() {
  return read().admin || { ...EMPTY_ADMIN }
}

export function signInAdmin({
  accessToken = '',
  expiresIn = '',
  admin = {},
} = {}) {
  const profile = normalizeAdmin(admin)
  write({
    ...DEFAULT,
    signedIn: true,
    accessToken,
    expiresIn,
    name: profile.name,
    email: profile.email,
    admin: profile,
  })
}

export function updateSessionAdmin(adminPatch = {}) {
  const current = read()
  const admin = normalizeAdmin({ ...(current.admin || {}), ...adminPatch })
  write({
    ...current,
    signedIn: true,
    name: admin.name,
    email: admin.email,
    admin,
  })
  return admin
}

export function signOutAdmin() {
  write({ ...DEFAULT, admin: { ...EMPTY_ADMIN }, signedIn: false })
}

export function useAdminSession() {
  useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(DEFAULT))
  return read()
}
