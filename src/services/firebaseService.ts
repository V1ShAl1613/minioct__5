import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config.ts';
import type {
  Opportunity,
  Announcement,
  SavedOpportunity,
  ApplicationRecord,
  NotificationItem,
  UserProfile,
} from '../types/index.ts';
import { SEED_OPPORTUNITIES, SEED_ANNOUNCEMENTS, DEMO_STUDENT } from '../firebase/seedData.ts';

// Storage keys for local offline resilience & immediate fast boot
const STORAGE_KEYS = {
  OPPORTUNITIES: 'campusconnect_opportunities',
  ANNOUNCEMENTS: 'campusconnect_announcements',
  SAVED: 'campusconnect_saved',
  APPLICATIONS: 'campusconnect_applications',
  NOTIFICATIONS: 'campusconnect_notifications',
  USER_PROFILE: 'campusconnect_user_profile',
};

// Seed Firestore if collection is empty
export async function initializeDatabaseIfEmpty(): Promise<void> {
  try {
    const oppSnapshot = await getDocs(collection(db, 'opportunities'));
    if (oppSnapshot.empty) {
      console.log('Seeding initial opportunities into Firestore...');
      const batch = writeBatch(db);
      for (const opp of SEED_OPPORTUNITIES) {
        const ref = doc(db, 'opportunities', opp.id);
        batch.set(ref, opp);
      }
      for (const ann of SEED_ANNOUNCEMENTS) {
        const ref = doc(db, 'announcements', ann.id);
        batch.set(ref, ann);
      }
      // Demo student
      const userRef = doc(db, 'users', DEMO_STUDENT.id);
      batch.set(userRef, DEMO_STUDENT);

      await batch.commit();
      console.log('Firestore seed completed successfully.');
    }
  } catch (error) {
    console.warn('Database initialization note (using local cache if unauthenticated):', error);
  }
}

// Opportunities
export async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const snapshot = await getDocs(collection(db, 'opportunities'));
    if (!snapshot.empty) {
      const items: Opportunity[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetch failed, checking local cache or seed data');
  }

  const cached = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  // Fallback to seed data
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(SEED_OPPORTUNITIES));
  return SEED_OPPORTUNITIES;
}

export async function saveOpportunityAdmin(opportunity: Opportunity): Promise<void> {
  const oppId = opportunity.id || `opp-${Date.now()}`;
  const data = { ...opportunity, id: oppId, updatedAt: new Date().toISOString() };

  try {
    await setDoc(doc(db, 'opportunities', oppId), data);
  } catch (error) {
    console.warn('Firestore write fallback to local storage:', error);
  }

  // Update local storage
  const current = await getOpportunities();
  const index = current.findIndex(o => o.id === oppId);
  if (index >= 0) {
    current[index] = data;
  } else {
    current.unshift(data);
  }
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(current));
}

export async function deleteOpportunityAdmin(opportunityId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'opportunities', opportunityId));
  } catch (error) {
    console.warn('Firestore delete fallback:', error);
  }

  const current = await getOpportunities();
  const filtered = current.filter(o => o.id !== opportunityId);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(filtered));
}

// Announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const snapshot = await getDocs(collection(db, 'announcements'));
    if (!snapshot.empty) {
      const items: Announcement[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore announcements fetch fallback to local cache');
  }

  const cached = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
  return SEED_ANNOUNCEMENTS;
}

export async function saveAnnouncementAdmin(announcement: Announcement): Promise<void> {
  const annId = announcement.id || `ann-${Date.now()}`;
  const data = { ...announcement, id: annId };

  try {
    await setDoc(doc(db, 'announcements', annId), data);
  } catch (error) {
    console.warn('Firestore announcement write fallback:', error);
  }

  const current = await getAnnouncements();
  const index = current.findIndex(a => a.id === annId);
  if (index >= 0) {
    current[index] = data;
  } else {
    current.unshift(data);
  }
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(current));
}

export async function deleteAnnouncementAdmin(announcementId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error) {
    console.warn('Firestore announcement delete fallback:', error);
  }

  const current = await getAnnouncements();
  const filtered = current.filter(a => a.id !== announcementId);
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(filtered));
}

// Saved Opportunities
export async function getSavedOpportunities(userId: string): Promise<string[]> {
  try {
    const q = query(collection(db, 'savedOpportunities'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const ids: string[] = [];
    snapshot.forEach(docSnap => {
      ids.push(docSnap.data().opportunityId);
    });
    return ids;
  } catch (err) {
    // Local fallback
    const key = `${STORAGE_KEYS.SAVED}_${userId}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : ['opp-1', 'opp-2'];
  }
}

export async function toggleSaveOpportunity(userId: string, opportunityId: string): Promise<boolean> {
  const key = `${STORAGE_KEYS.SAVED}_${userId}`;
  const cached = localStorage.getItem(key);
  let savedIds: string[] = cached ? JSON.parse(cached) : ['opp-1', 'opp-2'];

  const isSaved = savedIds.includes(opportunityId);
  const saveDocId = `${userId}_${opportunityId}`;

  if (isSaved) {
    savedIds = savedIds.filter(id => id !== opportunityId);
    try {
      await deleteDoc(doc(db, 'savedOpportunities', saveDocId));
    } catch {}
  } else {
    savedIds.push(opportunityId);
    try {
      await setDoc(doc(db, 'savedOpportunities', saveDocId), {
        userId,
        opportunityId,
        createdAt: new Date().toISOString(),
      });
    } catch {}
  }

  localStorage.setItem(key, JSON.stringify(savedIds));
  return !isSaved;
}

// Applications Tracking
export async function getApplications(userId: string): Promise<ApplicationRecord[]> {
  try {
    const q = query(collection(db, 'applications'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const items: ApplicationRecord[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });
    if (items.length > 0) return items;
  } catch (err) {
    // Fallback
  }

  const key = `${STORAGE_KEYS.APPLICATIONS}_${userId}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Initial seed applications for demo student
  const defaultApps: ApplicationRecord[] = [
    {
      id: `app-demo-1`,
      userId,
      opportunityId: 'opp-2',
      status: 'Applied',
      appliedAt: '2026-09-24T10:00:00Z',
      updatedAt: '2026-09-24T10:00:00Z',
      notes: 'Submitted resume and transcript via Google Careers student portal.',
    },
    {
      id: `app-demo-2`,
      userId,
      opportunityId: 'opp-1',
      status: 'Selected',
      appliedAt: '2026-09-29T14:30:00Z',
      updatedAt: '2026-10-02T11:00:00Z',
      notes: 'Team "NeuralHacks" proposal accepted! Track: Enterprise Generative AI.',
    },
    {
      id: `app-demo-3`,
      userId,
      opportunityId: 'opp-3',
      status: 'Interview',
      appliedAt: '2026-09-30T16:00:00Z',
      updatedAt: '2026-10-03T09:00:00Z',
      notes: 'Technical screening round scheduled for Friday at 3:00 PM.',
    },
    {
      id: `app-demo-4`,
      userId,
      opportunityId: 'opp-6',
      status: 'Planning to Apply',
      appliedAt: '2026-10-01T12:00:00Z',
      updatedAt: '2026-10-01T12:00:00Z',
      notes: 'Preparing financial analytics portfolio project to include.',
    },
  ];
  localStorage.setItem(key, JSON.stringify(defaultApps));
  return defaultApps;
}

export async function updateApplicationRecord(
  userId: string,
  record: ApplicationRecord
): Promise<void> {
  const docId = record.id || `${userId}_${record.opportunityId}`;
  const payload = {
    ...record,
    id: docId,
    userId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'applications', docId), payload);
  } catch {}

  const key = `${STORAGE_KEYS.APPLICATIONS}_${userId}`;
  const apps = await getApplications(userId);
  const idx = apps.findIndex(a => a.id === docId || a.opportunityId === record.opportunityId);
  if (idx >= 0) {
    apps[idx] = payload;
  } else {
    apps.unshift(payload);
  }
  localStorage.setItem(key, JSON.stringify(apps));
}

// Notifications
export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const items: NotificationItem[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });
    if (items.length > 0) return items;
  } catch (err) {}

  const key = `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const defaultNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId,
      type: 'match',
      title: '94% Match: AI Innovation Hackathon',
      message: 'New hackathon matches your Python and AI/ML skills.',
      read: false,
      createdAt: '2026-10-04T10:00:00Z',
    },
    {
      id: 'notif-2',
      userId,
      type: 'deadline',
      title: 'Deadline Alert: Python Dev Internship',
      message: 'Applications close in 4 days (October 8). Do not miss out!',
      read: false,
      createdAt: '2026-10-04T08:30:00Z',
    },
    {
      id: 'notif-3',
      userId,
      type: 'announcement',
      title: 'Mandatory Placement Verification',
      message: 'Training & Placement cell opened the portal. Submit before Oct 15.',
      read: true,
      createdAt: '2026-10-02T11:00:00Z',
    },
    {
      id: 'notif-4',
      userId,
      type: 'application',
      title: 'Interview Scheduled: Nexora Tech',
      message: 'Your Python developer application moved to Technical Interview.',
      read: false,
      createdAt: '2026-10-03T15:20:00Z',
    },
  ];

  localStorage.setItem(key, JSON.stringify(defaultNotifications));
  return defaultNotifications;
}

export async function markNotificationAsRead(userId: string, notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch {}

  const key = `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    const list: NotificationItem[] = JSON.parse(cached);
    const updated = list.map(n => (n.id === notifId ? { ...n, read: true } : n));
    localStorage.setItem(key, JSON.stringify(updated));
  }
}

// User Profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as any) };
    }
  } catch {}

  const key = `${STORAGE_KEYS.USER_PROFILE}_${userId}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  if (userId === DEMO_STUDENT.id) {
    return DEMO_STUDENT;
  }
  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const data = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', profile.id), data);
  } catch (e) {
    console.warn('Profile save offline/fallback:', e);
  }

  const key = `${STORAGE_KEYS.USER_PROFILE}_${profile.id}`;
  localStorage.setItem(key, JSON.stringify(data));
}
