import { createToken, type TokenType } from 'chevrotain';
import {
  DefaultTokenBuilder,
  type GrammarAST,
  type Stream,
  type TokenBuilderOptions,
} from 'langium';

import {
  matchMindmapIndent,
  matchMindmapNodeDefault,
  matchMindmapNodeId,
  matchMindmapOutdent,
} from './mindmapMatcher.js';

export const MINDMAP_OUTDENT: TokenType = createToken({
  line_breaks: false,
  name: 'MINDMAP_OUTDENT',
  pattern: matchMindmapOutdent,
});

export class MindmapTokenBuilder extends DefaultTokenBuilder {
  protected override buildTerminalTokens(rules: Stream<GrammarAST.AbstractRule>): TokenType[] {
    let tokenTypes: TokenType[] = super.buildTerminalTokens(rules);
    tokenTypes = tokenTypes.filter(
      (tokenType: TokenType): boolean => tokenType.name !== 'WHITESPACE'
    );
    tokenTypes.forEach((tokenType: TokenType, index: number): void => {
      switch (tokenType.name) {
        case 'MINDMAP_OUTDENT': {
          tokenTypes[index] = MINDMAP_OUTDENT;
          break;
        }
        case 'MINDMAP_INDENT': {
          tokenType.LINE_BREAKS = false;
          tokenType.PATTERN = matchMindmapIndent;
          break;
        }
        case 'MINDMAP_NODE_ID': {
          tokenType.LINE_BREAKS = false;
          tokenType.PATTERN = matchMindmapNodeId;
          break;
        }
        case 'MINDMAP_NODE_DEFAULT': {
          tokenType.LINE_BREAKS = false;
          tokenType.PATTERN = matchMindmapNodeDefault;
          break;
        }
      }
    });
    return tokenTypes;
  }

  protected override buildKeywordTokens(
    rules: Stream<GrammarAST.AbstractRule>,
    terminalTokens: TokenType[],
    options?: TokenBuilderOptions
  ): TokenType[] {
    const tokenTypes: TokenType[] = super.buildKeywordTokens(rules, terminalTokens, options);
    tokenTypes.forEach((tokenType: TokenType): void => {
      if (tokenType.name === 'mindmap' && tokenType.PATTERN !== undefined) {
        tokenType.PATTERN = new RegExp(tokenType.PATTERN.toString() + '(?!\\S)');
      }
    });
    return tokenTypes;
  }
}