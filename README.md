<img width="1440" alt="image" src="https://github.com/user-attachments/assets/11aabd45-cf27-4a77-b1a8-1f64eebc2ebe" />

# di-config-module-schematic

## How to use

- Clone the project
- In your angular project directory run `schematics <path-to-schematics-project>:di-config-module-schematic` (This schematic is built to use prompts. Hence eliminating the need to pass/look for the schematic's options
- Answer the questions asked in the terminal, you should have your module created and set-up to support DI(dependency injection).

## How to use a module with DI support
Assuming you provided payments as the module name during generation;

### 1: Edit the `payment.interface.ts` file with the definitions of your configuration properties. See example below;

```ts
export interface PaymentsConfig {
  baseUrl: string;            // The base URL for the payments API
  currency: string;           // Default currency for transactions
  retryAttempts: number;      // Number of retry attempts for failed requests
  enableDebugMode: boolean;   // Whether to enable debug mode for logging
}
```

### 2: Import generated module where needed. Eg;

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PaymentsModule } from './app/payments/payments.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
     PaymentsModule.forRoot({
      baseUrl: 'https://api.example.com/payments',  // Payments API URL
      currency: 'USD',                             // Default currency
      retryAttempts: 3,                            // Retry attempts for failed requests
      enableDebugMode: true,                       // Enable debug mode
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```
Explanation:

The forRoot method configures the module with a PaymentsConfig object.

### 3: Inject Configuration in Components

```ts
import { Component, Inject } from '@angular/core';
import { PAYMENTS_CONFIG_TOKEN } from './app/payments/payments-injection-tokens';
import { PaymentsConfig } from './app/payments/payments-config.interface';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome to the Payments App</h1>
    <p>Base URL: {{ config.baseUrl }}</p>
    <p>Default Currency: {{ config.currency }}</p>
    <p>Retry Attempts: {{ config.retryAttempts }}</p>
    <p>Debug Mode: {{ config.enableDebugMode ? 'Enabled' : 'Disabled' }}</p>
  `,
})
export class AppComponent {
  constructor(@Inject(PAYMENTS_CONFIG_TOKEN) public config: PaymentsConfig) {
        console.log("config props", config.baseUrl,  config.currency, config.retryAttempts, config.enableDebugMode)
   }
}
```



# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
