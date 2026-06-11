import { CodeNode, CodeHighlightNode } from "@lexical/code";
import {
  createServerFeature,
  createNode,
} from "@payloadcms/richtext-lexical";

export const LexicalCodeFeature = createServerFeature({
  feature: {
    ClientFeature: "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient",
    clientFeatureProps: null,
    nodes: [
      createNode({ node: CodeNode }),
      createNode({ node: CodeHighlightNode }),
    ],
  },
  key: "lexicalCode",
});
