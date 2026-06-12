import { sendGTMEvent } from '@next/third-parties/google'

export type GTMEvent =
  | { event: 'generate_lead'; form_source: 'contact' | 'talent_dialog'; inquiry_type?: string }
  | { event: 'form_error'; form_source: 'contact' | 'talent_dialog'; error_message: string }
  | { event: 'file_download'; file_name: string; location: 'rail' | 'mobile_menu' }
  | { event: 'cta_click'; cta_label: string; cta_location: string; destination: string }
  | { event: 'outbound_click'; link_url: string; link_domain: string; context: string }
  | { event: 'popup_impression'; form_source: 'talent_dialog' }
  | { event: 'popup_dismiss'; form_source: 'talent_dialog' }
  | { event: 'search'; search_term: string }
  | { event: 'filter_apply'; filter_type: string; filter_value: string }
  | { event: 'scroll_depth'; depth: 25 | 50 | 75 | 100; page: string }
  | { event: 'section_view'; section_id: string; page: string }
  | { event: 'nav_click'; label: string; destination: string }
  | { event: 'post_read_milestone'; slug: string; milestone: 25 | 50 | 75 | 100 }

export function trackEvent(event: GTMEvent): void {
  sendGTMEvent(event)
}

export function outboundParams(
  url: string,
  context: string,
): { link_url: string; link_domain: string; context: string } {
  let link_domain: string
  try {
    link_domain = new URL(url).hostname
  } catch {
    link_domain = url
  }
  return { link_url: url, link_domain, context }
}
