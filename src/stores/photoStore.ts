import { defineStore } from 'pinia'
import type { Photo } from '@/types'
import { db } from '@/db'
import { generateId } from '@/utils/id'

export const usePhotoStore = defineStore('photos', () => {
  async function addPhoto(entryId: string, tripId: string, url: string, caption?: string): Promise<Photo> {
    const photo: Photo = {
      id: generateId(),
      entryId,
      tripId,
      url,
      caption,
      createdAt: new Date().toISOString(),
    }
    await db.photos.add(photo)
    return photo
  }

  async function getPhotosForEntry(entryId: string): Promise<Photo[]> {
    return db.photos.where('entryId').equals(entryId).toArray()
  }

  async function getPhotosForTrip(tripId: string): Promise<Photo[]> {
    return db.photos.where('tripId').equals(tripId).toArray()
  }

  async function deletePhoto(id: string): Promise<void> {
    await db.photos.delete(id)
  }

  async function updateCaption(id: string, caption: string): Promise<void> {
    await db.photos.update(id, { caption })
  }

  async function reassignPhotos(fromEntryId: string, toEntryId: string, tripId: string): Promise<void> {
    const photos = await db.photos
      .where('tripId').equals(tripId)
      .filter((p) => p.entryId === fromEntryId)
      .toArray()
    for (const photo of photos) {
      await db.photos.update(photo.id, { entryId: toEntryId })
    }
  }

  return {
    addPhoto,
    getPhotosForEntry,
    getPhotosForTrip,
    deletePhoto,
    updateCaption,
    reassignPhotos,
  }
})
