import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SiteIdentityProvider, useSiteIdentity } from '../site-identity-provider'
import type { SiteIdentity } from '@/lib/site-identity'

const mockIdentity: SiteIdentity = {
  name: 'Test User',
  handle: 'testuser',
  role: 'Engineer',
  location: 'Test City',
  timezone: 'UTC',
  email: 'test@example.com',
  url: 'https://example.com',
  description: 'Test description',
  socials: [],
  resumeUrl: 'https://example.com/resume.pdf',
  status: {
    available: true,
    label: 'OPEN',
  },
}

// Test component that uses the hook
function ComponentUsingHook() {
  const identity = useSiteIdentity()
  return <div>{identity.name}</div>
}

describe('SiteIdentityProvider', () => {
  it('useSiteIdentity throws when used outside provider', () => {
    expect(() => {
      render(<ComponentUsingHook />)
    }).toThrow('useSiteIdentity must be used within SiteIdentityProvider')
  })

  it('useSiteIdentity returns identity when inside SiteIdentityProvider', () => {
    const { getByText } = render(
      <SiteIdentityProvider identity={mockIdentity}>
        <ComponentUsingHook />
      </SiteIdentityProvider>
    )

    expect(getByText('Test User')).toBeTruthy()
  })
})
