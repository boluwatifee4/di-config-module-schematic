"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const collectionPath = path.join(__dirname, '../collection.json');
describe('di-config-module-schematic', () => {
    it('works', async () => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        const tree = await runner.runSchematic('di-config-module-schematic', {}, schematics_1.Tree.empty());
        expect(tree.files).toEqual([]);
    });
});
//# sourceMappingURL=index_spec.js.map