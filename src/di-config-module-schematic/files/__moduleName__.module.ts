import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(moduleName) %>Config } from './<%= dasherize(moduleName) %>-config.interface';
import { <%= tokenName %> } from './<%= dasherize(moduleName) %>-injection-tokens';

@NgModule({
    imports: [CommonModule],
    declarations: [],
})
export class <%= classify(moduleName) %>Module {
    static forRoot(config: <%= classify(moduleName) %>Config): ModuleWithProviders<<%= classify(moduleName) %>Module> {
        return {
            ngModule: <%= classify(moduleName) %>Module,
            providers: [
                { provide: <%= tokenName %>, useValue: config },
            ],
        };
    }
}
