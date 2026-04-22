// Client-only — uses Canvas API. Do not import from server components.

interface ConvertOptions {
  /** WebP quality 0–1. Default 0.85. */
  quality?: number
  /** Clamp the longer edge to this many pixels. Default 2048. */
  maxDimension?: number
}

/**
 * Converts any browser-readable image file to WebP.
 * Downscales if either dimension exceeds maxDimension.
 * Returns a new File with a .webp extension.
 */
export function convertToWebP(file: File, options: ConvertOptions = {}): Promise<File> {
  const { quality = 0.85, maxDimension = 2048 } = options

  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let w = img.naturalWidth
      let h = img.naturalHeight

      if (w > maxDimension || h > maxDimension) {
        const ratio = Math.min(maxDimension / w, maxDimension / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas unavailable'))
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('WebP conversion failed'))
          const name = file.name.replace(/\.[^.]+$/, '.webp')
          resolve(new File([blob], name, { type: 'image/webp' }))
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load image'))
    }

    img.src = objectUrl
  })
}
