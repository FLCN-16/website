import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { CodeHighlightPlugin } from './code-highlight-plugin'

export const CodeHighlightFeatureClient = createClientFeature({
  nodes: [CodeNode, CodeHighlightNode],
  plugins: [
    {
      Component: CodeHighlightPlugin,
      position: 'normal',
    },
  ],
})
