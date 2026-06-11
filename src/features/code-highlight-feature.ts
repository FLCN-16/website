import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'

export const CodeHighlightFeature = createServerFeature({
  feature: {
    ClientFeature:
      '@/features/code-highlight-feature.client#CodeHighlightFeatureClient',
    clientFeatureProps: null,
    nodes: [
      createNode({ node: CodeNode }),
      createNode({ node: CodeHighlightNode }),
    ],
  },
  key: 'codeHighlight',
})
