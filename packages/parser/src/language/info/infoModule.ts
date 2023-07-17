import {
  DefaultSharedModuleContext,
  LangiumServices,
  LangiumSharedServices,
  Module,
  PartialLangiumServices,
  createDefaultModule,
  createDefaultSharedModule,
  inject,
} from 'langium';

import { MermaidGeneratedSharedModule, InfoGeneratedModule } from '../generated/module.js';

export type InfoServices = LangiumServices;

/**
 * Dependency injection module that overrides Langium default services and
 * contributes the declared `Info` services.
 */
export const InfoModule: Module<InfoServices, PartialLangiumServices> = {};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 * @param context - Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createInfoServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices;
  Info: InfoServices;
} {
  const shared: LangiumSharedServices = inject(
    createDefaultSharedModule(context),
    MermaidGeneratedSharedModule
  );
  const Info: InfoServices = inject(
    createDefaultModule({ shared }),
    InfoGeneratedModule,
    InfoModule
  );
  shared.ServiceRegistry.register(Info);
  return { shared, Info };
}