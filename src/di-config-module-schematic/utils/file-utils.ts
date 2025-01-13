import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { Schema } from '../../models/Ischema';
import { strings } from '@angular-devkit/core';

export function generateMissingFiles(tree: Tree, dir: string, options: Schema): void {
    const configPath = `${dir}/${strings.dasherize(options.moduleName)}-config.interface.ts`;
    const tokenPath = `${dir}/${strings.dasherize(options.moduleName)}-injection-tokens.ts`;

    if (!tree.exists(configPath)) {
        tree.create(configPath, `
      export interface ${strings.classify(options.configInterfaceName)} {
          // Define your configuration properties here
      }
    `);
    }

    if (!tree.exists(tokenPath)) {
        tree.create(tokenPath, `
      import { InjectionToken } from '@angular/core';
      import { ${strings.classify(options.configInterfaceName)} } from './${strings.dasherize(options.moduleName)}-config.interface';

      export const ${options.tokenName} = new InjectionToken<${strings.classify(
            options.configInterfaceName
        )}>('${options.tokenName}');
    `);
    }
}

export function addForRootMethod(
    moduleContent: string,
    options: Schema,
    _context: SchematicContext
): string {
    const classDeclarationRegex = new RegExp(
        `export class ${strings.classify(options.moduleName)}Module\\s*\\{`,
        'm'
    );
    const match = moduleContent.match(classDeclarationRegex);

    if (!match) {
        throw new Error(`Module class "${strings.classify(options.moduleName)}Module" not found.`);
    }

    const forRootMethod = `
  static forRoot(config: ${strings.classify(options.configInterfaceName)}): ModuleWithProviders<${strings.classify(
        options.moduleName
    )}Module> {
    return {
      ngModule: ${strings.classify(options.moduleName)}Module,
      providers: [
        { provide: ${options.tokenName}, useValue: config },
      ],
    };
  }
  `;

    return moduleContent.replace(classDeclarationRegex, `${match[0]}\n${forRootMethod}`);
}
