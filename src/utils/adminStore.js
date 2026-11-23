import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'makaan-admin-data-v14'
const listeners = new Set()

function nowOffset(hoursAgo) {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
}

function seed() {
  return {
    adminProfile: {
      name: 'Makaan Admin',
      email: 'admin@makaan.pk',
      phone: '+92 21 111 000 111',
      location: 'Head Office, Karachi',
      businessOpensAt: '09:00',
      businessClosesAt: '18:00',
    },
    agencies: [
      {
        id: 'ag-001',
        name: 'Raza Estates & Builders',
        contactPerson: 'Ahmed Raza',
        city: 'Karachi',
        phone: '+922134561001',
        email: 'ahmed.raza@razaestates.pk',
        officeAddress: '402, Sea Breeze Plaza, Shahrah-e-Faisal, Karachi',
        bio: 'Ahmed leads an 18-member team at Raza Estates & Builders, specialising in premium residential sales across Karachi. He is known for transparent PKR pricing and for guiding overseas Pakistanis through remote purchases.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        coverImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        licenseNumber: 'PK-RERA-KHI-2012-4821',
        responseTime: 'Within 2 hours',
        experienceYears: 14,
        teamSize: 18,
        specializations: ['Residential Sales', 'Luxury Villas', 'DHA & Bahria Town'],
        areasServed: ['DHA Karachi', 'Clifton', 'Bahria Town Karachi', 'Scheme 33'],
        services: [
          'Buyer representation and shortlisting',
          'Seller listing, marketing and staging',
          'Free property valuation and market report',
          'Sale, purchase and transfer documentation',
        ],
        listingsCount: 12,
        activeListings: 24,
        verified: true,
        rating: 4.9,
        reviews: 316,
        memberSince: 2012,
        languages: ['Urdu', 'English', 'Sindhi'],
        status: 'active',
        createdAt: nowOffset(720),
      },
      {
        id: 'ag-002',
        name: 'Lahore Prime Properties',
        contactPerson: 'Sana Malik',
        city: 'Lahore',
        phone: '+924235671002',
        email: 'sana@lahoreprime.pk',
        officeAddress: '12-B, MM Alam Road, Gulberg III, Lahore',
        bio: 'Sana works across Lahore with a focus on DHA and Bahria Town. Her team is trusted for honest valuations and clear communication with overseas investors.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        coverImage:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
        licenseNumber: 'PK-RERA-LHR-2014-2290',
        responseTime: 'Within 3 hours',
        experienceYears: 12,
        teamSize: 15,
        specializations: ['Residential Sales', 'Rentals & Leasing', 'Overseas Investor Deals'],
        areasServed: ['DHA Lahore', 'Bahria Town Lahore', 'Gulberg', 'Model Town'],
        services: [
          'Buyer representation and shortlisting',
          'Rental management and tenant screening',
          'Overseas investor advisory and video tours',
        ],
        listingsCount: 8,
        activeListings: 31,
        verified: true,
        rating: 4.9,
        reviews: 274,
        memberSince: 2014,
        languages: ['Urdu', 'English', 'Punjabi'],
        status: 'active',
        createdAt: nowOffset(480),
      },
      {
        id: 'ag-003',
        name: 'Capital Homes ISB',
        contactPerson: 'Usman Ali',
        city: 'Islamabad',
        phone: '+925128761003',
        email: 'usman@capitalhomes.pk',
        officeAddress: 'Office 8, Blue Area, Islamabad',
        bio: 'Usman helps buyers across Islamabad and Rawalpindi with apartment allotments, plot files and family homes. Strong focus on documentation and possession timelines.',
        avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
        coverImage:
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?auto=format&fit=crop&w=1400&q=80',
        licenseNumber: 'PK-RERA-ISB-2016-1188',
        responseTime: 'Within 4 hours',
        experienceYears: 9,
        teamSize: 10,
        specializations: ['Apartments & Flats', 'Residential Plots', 'Family Homes'],
        areasServed: ['F-sectors', 'Bahria Enclave', 'DHA Islamabad', 'Rawalpindi'],
        services: [
          'Buyer representation and shortlisting',
          'Sale, purchase and transfer documentation',
          'Free property valuation and market report',
        ],
        listingsCount: 5,
        activeListings: 14,
        verified: true,
        rating: 4.8,
        reviews: 142,
        memberSince: 2016,
        languages: ['Urdu', 'English'],
        status: 'active',
        createdAt: nowOffset(240),
      },
    ],
    agencyQueries: [
      {
        id: 'sup-001',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        subject: 'Listing stuck in draft after publish',
        topic: 'Publishing / draft',
        relatedId: 'prop-012',
        message:
          'Tried publishing a villa listing twice. Status stays on draft and the public site never shows it.',
        phone: '+92 300 1112233',
        attachments: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'in_review',
        reply: '',
        createdAt: nowOffset(26),
        updatedAt: nowOffset(4),
      },
      {
        id: 'sup-002',
        agencyId: 'ag-002',
        agencyName: 'Lahore Prime Properties',
        subject: 'Need help editing a recommendation',
        topic: 'Recommendations',
        relatedId: 'rec-101',
        message: 'Our recommendation was published but edit is locked for possession timeline.',
        phone: '+92 321 4445566',
        attachments: [],
        status: 'pending',
        reply: '',
        createdAt: nowOffset(8),
        updatedAt: nowOffset(8),
      },
      {
        id: 'sup-003',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        subject: 'Agency phone number not updating',
        topic: 'Profile / account',
        relatedId: '',
        message: 'Updated contact number but public agent page still shows old WhatsApp.',
        phone: '+92 300 1112233',
        attachments: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'responded',
        reply: 'Profile cache cleared. Please hard-refresh — new number should appear now.',
        createdAt: nowOffset(72),
        updatedAt: nowOffset(48),
      },
    ],
    // Contact Us (/contact) → admin: name, email, phone, reason, message
    userQueries: [
      {
        id: 'uq-001',
        name: 'Ali Hassan',
        email: 'ali.hassan@email.com',
        phone: '+92 300 1234567',
        reason: 'Buying',
        message:
          'Looking for a 10-marla house in DHA Lahore. Budget around 3–4 crore. Please advise next steps.',
        status: 'pending',
        reply: '',
        createdAt: nowOffset(6),
        updatedAt: nowOffset(6),
      },
      {
        id: 'uq-002',
        name: 'Fatima Noor',
        email: 'fatima.noor@email.com',
        phone: '+92 321 9876543',
        reason: 'Renting',
        message:
          'Need a furnished apartment in Gulberg Islamabad for 6 months. Family of 3. Prefer near schools.',
        status: 'in_review',
        reply: '',
        createdAt: nowOffset(14),
        updatedAt: nowOffset(3),
      },
      {
        id: 'uq-003',
        name: 'Hassan Raza',
        email: 'hassan.raza@email.com',
        phone: '',
        reason: 'General Inquiry',
        message:
          'How do I list my property on Makaan? Do I need an agency account or can I post as an owner?',
        status: 'responded',
        reply:
          'Thanks for reaching out. Owner listings go through a verified agency partner — we can connect you with one in your city.',
        createdAt: nowOffset(40),
        updatedAt: nowOffset(20),
      },
    ],
    reels: [
      {
        id: 'reel-001',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        title: 'DHA Phase 6 Villa Walkthrough',
        city: 'Karachi',
        area: 'DHA Phase 6',
        projectType: 'Villas',
        purpose: 'Sale',
        caption: '4 bed luxury villa with lawn — soft launch inventory.',
        video: '/reels/villa.mp4?v=hd2',
        cover:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
        durationSec: 10,
        views: 1240,
        disabled: false,
        createdAt: nowOffset(30),
      },
      {
        id: 'reel-002',
        agencyId: 'ag-002',
        agencyName: 'Lahore Prime Properties',
        title: 'Bahria Town Apartment Tour',
        city: 'Islamabad',
        area: 'Bahria Town',
        projectType: 'Apartments',
        purpose: 'Rent',
        caption: 'Ready 2 bed with open kitchen and covered parking.',
        video: '/reels/living.mp4?v=hd2',
        cover:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
        durationSec: 40,
        views: 860,
        disabled: false,
        createdAt: nowOffset(18),
      },
      {
        id: 'reel-003',
        agencyId: 'ag-003',
        agencyName: 'Capital Homes ISB',
        title: 'Clifton Sea-View Flat',
        city: 'Karachi',
        area: 'Clifton',
        projectType: 'Apartments',
        purpose: 'Rent',
        caption: 'Furnished sea-view floors with steady rental demand.',
        video: '/reels/interior.mp4?v=hd2',
        cover:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
        durationSec: 36,
        views: 420,
        disabled: true,
        createdAt: nowOffset(10),
      },
    ],
    recommendations: [
      {
        id: 'rec-001',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        agencyAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Askari apartment yields — who should buy',
        projectName: 'Askari Towers',
        category: 'Investment Opportunities',
        location: 'Askari Towers',
        city: 'Rawalpindi',
        coverImage:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
        content: [
          {
            heading: 'Why we recommend it',
            value: 'Stable tenant demand from officers and corporate staff.',
          },
          {
            heading: 'Market insights',
            value: '3-bed furnished units lease faster than unfurnished.',
          },
          {
            heading: 'Future prospects',
            value: 'Yields may compress if new supply arrives nearby.',
          },
        ],
        status: 'draft',
        publishedAt: '',
        updatedAt: nowOffset(40),
      },
      {
        id: 'rec-002',
        agencyId: 'ag-002',
        agencyName: 'Lahore Prime Properties',
        agencyAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: 'Johar Town rentals for families',
        projectName: 'Johar Town Family Desk',
        category: 'Market Insights',
        location: 'Johar Town',
        city: 'Lahore',
        coverImage:
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
        content: [
          {
            heading: 'Why we recommend it',
            value: 'Family demand stays firm near schools and parks.',
          },
          {
            heading: 'Market insights',
            value: '2–3 bed units move faster than larger shell apartments.',
          },
        ],
        status: 'published',
        publishedAt: '2026-10-18',
        updatedAt: nowOffset(12),
      },
      {
        id: 'rec-003',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        agencyAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Clifton high-rise floors worth shortlisting',
        projectName: 'Clifton Sea View',
        category: 'Trending Projects',
        location: 'Block 4, Clifton',
        city: 'Karachi',
        coverImage:
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
        content: [
          {
            heading: 'Why we recommend it',
            value: 'Sea-facing floors with clear instalment plans are moving faster than mid-tower inventory.',
          },
          {
            heading: 'Buyer fit',
            value: 'Best for end-users needing possession within 24–30 months.',
          },
        ],
        status: 'published',
        publishedAt: '2026-10-22',
        updatedAt: nowOffset(8),
      },
      {
        id: 'rec-004',
        agencyId: 'ag-003',
        agencyName: 'Capital Homes ISB',
        agencyAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        title: 'Bahria Enclave plots — booking window notes',
        projectName: 'Bahria Enclave',
        category: 'Upcoming Projects',
        location: 'Bahria Enclave',
        city: 'Islamabad',
        coverImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        content: [
          {
            heading: 'Why we recommend it',
            value: 'Cleaner file paperwork and structured payment plans versus nearby unregulated societies.',
          },
        ],
        status: 'pending',
        publishedAt: '',
        updatedAt: nowOffset(4),
      },
    ],
    listings: [
      {
        id: 'prop-001',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        kind: 'property',
        title: 'Brand New 300 Sq. Yd Villa',
        projectName: 'DHA Phase 8 Villas',
        location: 'DHA Phase 8, Karachi',
        city: 'Karachi',
        propertyType: 'bungalow',
        purpose: 'buy',
        price: 85000000,
        parking: 2,
        size: { area: 'sq', unit: 300 },
        bedrooms: 6,
        bathrooms: 7,
        amenities: ['Parking', 'Security', 'Garden', 'Servant Quarter', 'CCTV'],
        highlights: [
          'Brand-new villa in DHA Phase 8',
          'Six bedrooms and seven bathrooms',
          'Corner facing with wide frontage',
        ],
        about:
          'A spacious, newly built villa in DHA Phase 8, designed for comfortable family living with generous bedrooms, multiple bathrooms and a 300 Sq. Yd footprint.',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
        ],
        disabled: false,
        createdAt: nowOffset(100),
      },
      {
        id: 'plot-001',
        agencyId: 'ag-001',
        agencyName: 'Raza Estates & Builders',
        kind: 'plot',
        title: 'Prime Corner Kanal Plot — Sector J',
        location: 'DHA Phase 6, Karachi',
        city: 'Karachi',
        propertyType: 'plot',
        purpose: 'buy',
        price: 42000000,
        size: { area: 'kanal', unit: 1 },
        plotNo: 'Plot 412-J',
        dimensions: "90' x 50'",
        ownership: 'Original allotment file in the seller name',
        possession: true,
        highlights: [
          'Corner plot with access from two streets',
          'Open green-belt view on the northern boundary',
          'Immediate possession with transfer-ready documents',
        ],
        about:
          'A true corner plot in the settled part of DHA Phase 6, with road frontage on two sides and cleared development charges.',
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
        ],
        disabled: false,
        createdAt: nowOffset(90),
      },
      {
        id: 'prop-002',
        agencyId: 'ag-002',
        agencyName: 'Lahore Prime Properties',
        kind: 'property',
        title: 'Modern Apartment Gulberg',
        projectName: 'Gulberg Heights',
        location: 'Gulberg III, Lahore',
        city: 'Lahore',
        propertyType: 'apartment',
        purpose: 'rent',
        price: 280000,
        parking: 1,
        size: { area: 'marla', unit: 10 },
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['Parking', 'Elevator', 'Security', 'Gym', 'Backup Generator'],
        highlights: [
          'Furnished apartment near MM Alam Road',
          'Three bedrooms with balcony access',
          'Society security and covered parking',
        ],
        about:
          'A modern 3-bed apartment in Gulberg with open kitchen, covered parking and easy access to commercial lanes.',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
        ],
        disabled: true,
        createdAt: nowOffset(60),
      },
      {
        id: 'plot-002',
        agencyId: 'ag-003',
        agencyName: 'Capital Homes ISB',
        kind: 'plot',
        title: 'Bahria Enclave 10 Marla',
        location: 'Bahria Enclave, Islamabad',
        city: 'Islamabad',
        propertyType: 'plot',
        purpose: 'buy',
        price: 18500000,
        size: { area: 'marla', unit: 10 },
        plotNo: 'Block C-218',
        dimensions: "60' x 45'",
        ownership: 'Transfer-ready society file',
        possession: false,
        highlights: [
          'Ten marla residential plot in Bahria Enclave',
          'Clear society paperwork for overseas buyers',
          'Near park and main boulevard access',
        ],
        about:
          'A 10 Marla residential plot in Bahria Enclave with clear file paperwork and strong end-user demand from Islamabad families.',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?auto=format&fit=crop&w=900&q=80',
        ],
        disabled: false,
        createdAt: nowOffset(20),
      },
    ],
    users: [
      {
        id: 'user-001',
        name: 'Ali Hassan',
        email: 'ali.hassan@email.com',
        phone: '+92 300 1234567',
        city: 'Karachi',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        createdAt: nowOffset(200),
      },
      {
        id: 'user-002',
        name: 'Fatima Noor',
        email: 'fatima.noor@email.com',
        phone: '+92 321 9876543',
        city: 'Lahore',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        createdAt: nowOffset(150),
      },
      {
        id: 'user-003',
        name: 'Hassan Raza',
        email: 'hassan.raza@email.com',
        phone: '+92 333 5556677',
        city: 'Islamabad',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        createdAt: nowOffset(80),
      },
    ],
    // Same fields lawyers fill on Lawyer Profile form
    lawyers: [
      {
        id: 'law-001',
        name: 'Adv. Sara Khan',
        city: 'Karachi',
        specialty: 'Title verification & society transfers',
        bio: 'Karachi property lawyer helping buyers verify ownership papers and society transfer files before they pay.',
        phone: '+92 21 3456 0101',
        whatsapp: '0323 2910307',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        createdAt: nowOffset(300),
      },
      {
        id: 'law-002',
        name: 'Adv. Bilal Ahmed',
        city: 'Lahore',
        specialty: 'Plot disputes & registry checks',
        bio: 'Lahore-based lawyer focused on plot verification, registry coordination and dispute screening for residential buyers.',
        phone: '+92 42 3567 0202',
        whatsapp: '0323 2910307',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: nowOffset(280),
      },
      {
        id: 'law-003',
        name: 'Adv. Hina Malik',
        city: 'Islamabad',
        specialty: 'Apartment allotments & POA review',
        bio: 'Islamabad lawyer for apartment allotments, possession papers and power-of-attorney deals involving overseas buyers.',
        phone: '+92 51 2876 0303',
        whatsapp: '0323 2910307',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        createdAt: nowOffset(260),
      },
    ],
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

function readRaw() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return parsed
  } catch {
    return null
  }
}

function ensureData() {
  const seeded = seed()
  const existing = readRaw()
  if (!existing || typeof existing !== 'object' || !Array.isArray(existing.agencies)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }

  let changed = false
  const next = { ...existing }

  // Backfill any missing collections (e.g. userQueries added later)
  Object.keys(seeded).forEach((key) => {
    if (next[key] == null) {
      next[key] = seeded[key]
      changed = true
    }
  })

  if (!Array.isArray(next.userQueries)) {
    next.userQueries = seeded.userQueries
    changed = true
  }
  if (!Array.isArray(next.agencyQueries)) {
    next.agencyQueries = seeded.agencyQueries
    changed = true
  }

  // Upgrade sparse listing rows to agency form-shaped records
  const listingsNeedUpgrade =
    !Array.isArray(next.listings) ||
    next.listings.some(
      (item) =>
        !item ||
        (!item.location && !item.about && !item.description) ||
        (!Array.isArray(item.images) && !item.image),
    )
  if (listingsNeedUpgrade) {
    next.listings = seeded.listings
    changed = true
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  return next
}

function writeData(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  emit()
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

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function useAdminStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '')
}

export function getAdminData() {
  return ensureData()
}

function normalizeAdminProfile(profile = {}) {
  const seeded = seed().adminProfile
  const next = {
    ...seeded,
    ...profile,
    businessOpensAt: profile.businessOpensAt || seeded.businessOpensAt,
    businessClosesAt: profile.businessClosesAt || seeded.businessClosesAt,
  }
  delete next.businessHours
  return next
}

export function getAdminProfile() {
  return normalizeAdminProfile(ensureData().adminProfile)
}

export function updateAdminProfile(patch) {
  const data = ensureData()
  data.adminProfile = normalizeAdminProfile({ ...data.adminProfile, ...patch })
  writeData(data)
  return data.adminProfile
}

function mutateList(key, updater) {
  const data = ensureData()
  data[key] = updater(data[key] || [])
  writeData(data)
  return data[key]
}

export function getAgencies() {
  return [...ensureData().agencies]
}

export function deleteAgency(id) {
  return mutateList('agencies', (list) => list.filter((item) => item.id !== id))
}

export function setAgencyStatus(id, status) {
  const nextStatus = status === 'inactive' ? 'inactive' : 'active'
  return mutateList('agencies', (list) =>
    list.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)),
  )
}

export function getAgencyQueries() {
  return [...ensureData().agencyQueries].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function updateAgencyQuery(id, patch) {
  return mutateList('agencyQueries', (list) =>
    list.map((item) =>
      item.id === id
        ? { ...item, ...patch, updatedAt: new Date().toISOString() }
        : item,
    ),
  )
}

export function getUserQueries() {
  return [...(ensureData().userQueries || [])].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function updateUserQuery(id, patch) {
  return mutateList('userQueries', (list) =>
    list.map((item) =>
      item.id === id
        ? { ...item, ...patch, updatedAt: new Date().toISOString() }
        : item,
    ),
  )
}

export function getReels() {
  return [...ensureData().reels].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function deleteReel(id) {
  return mutateList('reels', (list) => list.filter((item) => item.id !== id))
}

export function setReelDisabled(id, disabled) {
  return mutateList('reels', (list) =>
    list.map((item) => (item.id === id ? { ...item, disabled: Boolean(disabled) } : item)),
  )
}

export function getRecommendations() {
  return [...ensureData().recommendations].sort((a, b) =>
    String(b.updatedAt).localeCompare(String(a.updatedAt)),
  )
}

export function deleteRecommendation(id) {
  return mutateList('recommendations', (list) => list.filter((item) => item.id !== id))
}

export function getListings() {
  return [...ensureData().listings].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function deleteListing(id) {
  return mutateList('listings', (list) => list.filter((item) => item.id !== id))
}

export function setListingDisabled(id, disabled) {
  return mutateList('listings', (list) =>
    list.map((item) => (item.id === id ? { ...item, disabled: Boolean(disabled) } : item)),
  )
}

export function getUsers() {
  return [...ensureData().users].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function deleteUser(id) {
  return mutateList('users', (list) => list.filter((item) => item.id !== id))
}

export function getLawyers() {
  return [...ensureData().lawyers].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}

export function deleteLawyer(id) {
  return mutateList('lawyers', (list) => list.filter((item) => item.id !== id))
}

export const QUERY_STATUSES = {
  pending: 'Pending',
  in_review: 'In review',
  responded: 'Responded',
}
