"use client"

import { useEffect } from "react"
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

export function PostGallery({ galleryId }: { galleryId: string }) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: "a[data-pswp-src]",
      pswpModule: () => import("photoswipe"),
    })
    lightbox.init()
    return () => lightbox.destroy()
  }, [galleryId])

  return null
}
