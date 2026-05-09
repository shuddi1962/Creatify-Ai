import { getUploads, saveUpload as storageSave, getAPIKey } from './storage.js'

const MAX_UPLOADS = 20

export async function getUploadHistory() {
  try {
    const fromStorage = await getUploads()
    if (fromStorage.length > 0) return fromStorage
  } catch {}
  try {
    return JSON.parse(localStorage.getItem('muapi_uploads') || '[]')
  } catch { return [] }
}

export async function saveUpload({ id, name, uploadedUrl, thumbnail, timestamp }) {
  try {
    await storageSave({ id, name, uploadedUrl, thumbnail, timestamp, url: uploadedUrl, size: 0, type: '' })
  } catch {}
  const history = JSON.parse(localStorage.getItem('muapi_uploads') || '[]')
  history.unshift({ id, name, uploadedUrl, thumbnail, timestamp })
  localStorage.setItem('muapi_uploads', JSON.stringify(history.slice(0, MAX_UPLOADS)))
}

export function removeUpload(id) {
  const history = JSON.parse(localStorage.getItem('muapi_uploads') || '[]').filter(e => e.id !== id)
  localStorage.setItem('muapi_uploads', JSON.stringify(history))
}

export async function generateThumbnail(file) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const SIZE = 80
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2
      ctx.drawImage(img, sx, sy, size, size, 0, 0, SIZE, SIZE)
      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null) }
    img.src = objectUrl
  })
}
