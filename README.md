<img width="1440" alt="image" src="https://github.com/user-attachments/assets/11aabd45-cf27-4a77-b1a8-1f64eebc2ebe" />


# **di-config-module-schematic**

## **How to Use**

This schematic generates Angular modules with **Dependency Injection (DI)** support. You can use the schematic either **deployed from npm** or **locally** during development.

---

### **Option 1: Use the Deployed Schematic from npm**

1. Install the schematic globally:
   ```bash
   npm install -g di-config-module-schematic
   ```

2. Run the schematic in your Angular project directory:
   ```bash
   ng generate di-config-module-schematic:di-config-module-schematic
   ```

3. Follow the prompts in the terminal. Once completed, your module will be created and set up with **DI support**.

---

### **Option 2: Use the Schematic Locally**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/di-config-module-schematic.git
   cd di-config-module-schematic
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run the schematic in your Angular project:
   ```bash
   schematics <path-to-schematics-project>:di-config-module-schematic
   ```

4. Follow the prompts in the terminal. Once completed, your module will be created and set up with **DI support**.

---

## **How to Use a Module with DI Support**

### Example: Payments Module

Assume you provided `payments` as the module name during generation.

### **1. Define Configuration Properties**

Edit the `payments-config.interface.ts` file to include the configuration properties:

```typescript
export interface PaymentsConfig {
  baseUrl: string;            // The base URL for the payments API
  currency: string;           // Default currency for transactions
  retryAttempts: number;      // Number of retry attempts for failed requests
  enableDebugMode: boolean;   // Whether to enable debug mode for logging
}
```

---

### **2. Import and Configure the Module**

Import the generated module where needed and configure it using the `forRoot` method:

**Example: `app.module.ts`**
```typescript
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

---

### **3. Inject Configuration in Components**

Inject the configuration wherever required using the `PAYMENTS_CONFIG_TOKEN`.

**Example: `app.component.ts`**
```typescript
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
    console.log('Config Properties:', config.baseUrl, config.currency, config.retryAttempts, config.enableDebugMode);
  }
}
```

---

## **Getting Started With Schematics**

This repository serves as a starting point to create and publish Angular schematics.

### **Testing Locally**

1. Install the schematics CLI globally:
   ```bash
   npm install -g @angular-devkit/schematics-cli
   ```

2. Run the schematic locally using the `schematics` CLI:
   ```bash
   schematics ./src/di-config-module-schematic:di-config-module-schematic
   ```

3. Follow the prompts to generate your module.

---

### **Unit Testing**

Run unit tests with:
```bash
npm run test
```

This uses Jasmine as the test framework.

---!