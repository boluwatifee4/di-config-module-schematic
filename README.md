# **di-config-module-schematic** 🛠️

## **How to Use** 🧑‍💻

This schematic generates Angular modules with **Dependency Injection (DI)** support. It supports two key actions: **create** ➕ and **update** 🔄, making it easy to generate new modules or enhance existing ones. The schematic is designed to be directory-aware 📂, meaning:

- For **create** ➕: Run the schematic from the directory where the module should be created.
- For **update** 🔄: Run the schematic from the directory containing the module to be updated.

You can use the schematic either **deployed from npm** 🌐 or **locally** 💻 during development.

---

### **Option 1: Use the Deployed Schematic from npm** 🌐

1. Install the schematic globally:
   ```bash
   npm install -g di-config-module-schematic
   ```

2. Run the schematic in your Angular project directory:
   ```bash
   ng generate di-module
   ```

3. Follow the prompts in the terminal. Once completed:
   - For **create** ➕, a new module will be generated in the current directory.
   - For **update** 🔄, the specified module will be enhanced with DI support.

---

### **Option 2: Use the Schematic Locally** 💻

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
   schematics ./dist/src/di-config-module-schematic:di-module
   ```

4. Follow the prompts in the terminal. Once completed:
   - For **create** ➕, a new module will be generated in the current directory.
   - For **update** 🔄, the specified module will be enhanced with DI support.

---

## **Actions Supported** ✅

### **Create a Module** ➕

To create a new module:
1. Navigate 📂 to the directory where you want the module to be created (e.g., `src/app/modules`).
2. Run the schematic.
3. Provide the following details when prompted:
   - Module name 📛
   - Configuration interface name 📝
   - InjectionToken name 🔑

The schematic will generate the module and necessary files in the current directory.

### **Update an Existing Module** 🔄

To update an existing module:
1. Navigate 📂 to the directory containing the module to be updated (e.g., `src/app/modules/payments`).
2. Run the schematic.
3. Provide the following details when prompted:
   - Module name 📛
   - Configuration interface name 📝
   - InjectionToken name 🔑

The schematic will:
- Update the `forRoot` method for DI configuration if not already present.
- Generate missing files like the configuration interface 📝 and InjectionToken 🔑, if required.

---

## **How to Use a Module with DI Support** 🛠️

### Example: Payments Module 💳

Assume you provided `payments` as the module name during generation.

### **1. Define Configuration Properties** 📝

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

### **2. Import and Configure the Module** 📥

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

### **3. Inject Configuration in Components** ⚙️

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

### **Key Challenges and Solutions**

---

#### Path Normalization
- **Challenge:** 
  Files were created in incorrect locations due to absolute system paths (`/Users/...`) instead of workspace-relative paths (`apps/...`, `libs/...`).
- **Solution:** 
  Implemented a utility to detect the workspace root (`nx.json` or `angular.json`) and normalize paths dynamically.

---

####  User-Friendly Interaction
- **Challenge:** 
  Long CLI commands with multiple options were error-prone and intimidating for users.
- **Solution:** 
  Introduced interactive prompts using `x-prompt` and shortened the schematic name to `di-module` for a streamlined experience.

---

## **Getting Started With Schematics** 🏁

This repository serves as a starting point to create and publish Angular schematics.

### **Testing Locally** 🧪

1. Install the schematics CLI globally:
   ```bash
   npm install -g @angular-devkit/schematics-cli
   ```

2. Run the schematic locally using the `schematics` CLI:
   ```bash
   schematics ./dist/src/di-config-module-schematic:di-module
   ```

3. Follow the prompts to generate your module.

---

### **Unit Testing** 🧑‍🔬

Run unit tests with:
```bash
npm run test
```

This uses Jasmine as the test framework.

---

### **Publishing** 🚀

To publish, simply do:
```bash
npm run build
npm publish
```

---

