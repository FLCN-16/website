'use client'

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'

export const CodeHighlightFeatureClient = createClientFeature({
  nodes: [CodeNode, CodeHighlightNode],
})
