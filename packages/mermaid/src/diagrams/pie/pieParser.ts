import { MermaidServices, Pie, createMermaidServices } from 'mermaid-parser';
import { EmptyFileSystem, LangiumParser, ParseResult } from 'langium';
import { log } from '../../logger.js';
import pieDb from './pieDb.js';

const services: MermaidServices = createMermaidServices(EmptyFileSystem).Mermaid;
const parser: LangiumParser = services.parser.LangiumParser;

export function parse(input: string): void {
  const result: ParseResult<Pie> = parser.parse(input);

  if (result.parserErrors.length > 0 || result.lexerErrors.length > 0) {
    log.error(
      { parserErrors: result.parserErrors, lexerErrors: result.lexerErrors },
      'Error parsing info diagram'
    );
    throw new Error(`Parser errors: ${result.parserErrors} Lex errors: ${result.lexerErrors}`);
  }

  const value = result.value;
  if (value.accDescr !== undefined) {
    pieDb.setAccDescription(value.accDescr);
  }
  if (value.accTitle !== undefined) {
    pieDb.setAccTitle(value.accTitle);
  }
  if (value.title !== undefined) {
    pieDb.setDiagramTitle(value.title);
  }
  pieDb.setShowData(value.showData);
  for (const section of value.sections) {
    pieDb.addSection(section.label, section.value);
  }
}