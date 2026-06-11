'use client'
import { createContext, useContext } from 'react'
import type { SiteIdentity } from '@/lib/site-identity'

const SiteIdentityContext = createContext<SiteIdentity | null>(null)

export function SiteIdentityProvider({
  identity,
  children,
}: {
  identity: SiteIdentity
  children: React.ReactNode
}) {
  return <SiteIdentityContext.Provider value={identity}>{children}</SiteIdentityContext.Provider>
}

export function useSiteIdentity(): SiteIdentity {
  const ctx = useContext(SiteIdentityContext)
  if (!ctx) throw new Error('useSiteIdentity must be used within SiteIdentityProvider')
  return ctx
}
