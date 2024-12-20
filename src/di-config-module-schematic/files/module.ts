import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(configInterfaceName) %> } from './<%= dasherize(configInterfaceName) %>.interface';
import { <%= tokenName %> } from './injection-tokens';

@NgModule({
    imports: [CommonModule],
    declarations: [],
})
export class <%= classify(moduleName) %> Module {
    static forRoot(config: <%= classify(configInterfaceName) %>): ModuleWithProviders <<%= classify(moduleName) %> Module > {
        return {
            ngModule: <%= classify(moduleName) %> Module,
        providers: [
            { provide: <%= tokenName %>, useValue: config },
            ],
};
    }
}
