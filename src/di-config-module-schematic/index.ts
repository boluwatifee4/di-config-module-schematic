import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../models/Ischema';
import { createModule } from './logic/create-module';
import { updateModule } from './logic/update-module';

export default function diConfigModuleSchematic(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info(`Action selected: ${options.action}`);

    switch (options.action) {
      case 'create':
        return createModule(options, context);
      case 'update':
        return updateModule(options, context);
      default:
        throw new Error('Invalid action. Please choose either "create" or "update".');
    }
  };
}
