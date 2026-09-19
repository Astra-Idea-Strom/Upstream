import { db, FieldValue, isFirebaseMock } from '../config/firebase';
import type { BrandProject } from '@upstream/shared';

const COLLECTION = 'brandProjects';

// In-memory store for development/testing when Firebase credentials are not yet configured
const inMemoryProjects = new Map<string, BrandProject>();

export async function saveProject(
  data: Omit<BrandProject, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const nowIso = new Date().toISOString();

  if (isFirebaseMock() || !db) {
    const id = `mock_proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const project: BrandProject = {
      ...data,
      id,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    inMemoryProjects.set(id, project);
    console.log(`[Storage:Mock] Project saved: ${id}`);
    return id;
  }

  const docRef = await db.collection(COLLECTION).add({
    ...data,
    createdAt: FieldValue ? FieldValue.serverTimestamp() : nowIso,
    updatedAt: FieldValue ? FieldValue.serverTimestamp() : nowIso,
  });
  console.log(`[Storage:Firestore] Project saved: ${docRef.id}`);
  return docRef.id;
}

export async function getProject(id: string): Promise<BrandProject | null> {
  if (isFirebaseMock() || !db) {
    return inMemoryProjects.get(id) || null;
  }

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data() as Record<string, any>;
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as BrandProject;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<BrandProject, 'id' | 'createdAt'>>
): Promise<void> {
  const nowIso = new Date().toISOString();

  if (isFirebaseMock() || !db) {
    const existing = inMemoryProjects.get(id);
    if (!existing) {
      throw new Error(`Project ${id} not found`);
    }
    inMemoryProjects.set(id, {
      ...existing,
      ...data,
      updatedAt: nowIso,
    });
    return;
  }

  await db.collection(COLLECTION).doc(id).update({
    ...data,
    updatedAt: FieldValue ? FieldValue.serverTimestamp() : nowIso,
  });
}

export async function listProjects(limit = 20): Promise<BrandProject[]> {
  if (isFirebaseMock() || !db) {
    return Array.from(inMemoryProjects.values()).slice(0, limit);
  }

  const snapshot = await db
    .collection(COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, any>;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as BrandProject;
  });
}
