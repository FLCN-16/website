'use client'

import { CodeHighlightNode, CodeNode, registerCodeHighlighting } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { useEffect } from 'react'

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])
  return null
}

export const CodeHighlightFeatureClient = createClientFeature({
  nodes: [CodeNode, CodeHighlightNode],
  plugins: [
    {
      Component: CodeHighlightPlugin,
      position: 'normal',
    },
  ],
})
