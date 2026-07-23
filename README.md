# React External App

An external React starter template for customer-facing apps on the Salesforce platform. Includes authentication, global search, and an Experience Cloud site container. Built with React, Vite, TypeScript, and Tailwind/shadcn.

## What's included

```
force-app/main/default/
├── classes/                      # Apex Auth Logic
│   ├── UIBundleAuthUtils.cls
│   ├── UIBundleChangePassword.cls
│   ├── UIBundleForgotPassword.cls
│   ├── UIBundleLogin.cls
│   └── UIBundleRegistration.cls
├── digitalExperienceConfigs/     # Site configuration
├── digitalExperiences/           # Site definition & branding
├── networks/                     # Experience Cloud network setup
├── sites/                        # Salesforce Site metadata
└── uiBundles/
    └── MyReactProject/         # React UI Bundle (source, config, tests)
```

## Prerequisites

Before you start, make sure you have:

- **Salesforce CLI** - Download from [developer.salesforce.com/tools/salesforcecli](https://developer.salesforce.com/tools/salesforcecli). See [Install Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm) for details.
- **VS Code with Salesforce Extension Pack** - See [Installation Instructions](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/install.html) for details. Includes the Agentforce Vibes extension.
- **Node.js (LTS)** - Required to install project dependencies and run the React development server.
- **A development org** - Sign up for a free Developer Edition org [here](https://developer.salesforce.com/signup).
- **Digital Experiences enabled** - In your Salesforce org, navigate to **Setup → Digital Experiences → Settings**, enable **Digital Experiences**, and configure a domain if prompted. This is required to deploy and access Experience Cloud applications.
- **Dev Hub enabled** (optional, required to create scratch orgs) - You can enable Dev Hub in your development org under **Setup → Dev Hub**. See [Provide Developers Access to Salesforce DX Tools](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_dx_tools.htm).


## Get Started

1. Login to salesforce through SFDX CLI and then create a new external app:
    ```bash
    sf org login web
    sf template generate project --name MyReactProject --template reactexternalapp
    ```
2. Open react project and install dependencies:
    ```bash
    cd force-app\main\default\uiBundles\MyReactProject
    npm install
    ```

## Deployment

1. Open react project directory
    ```
    cd force-app\main\default\uiBundles\MyReactProject
    ```

2. Build the project
    ```bash
    npm run build
    ```
3. Deploy on salesforce
    ```
    sf project deploy start --target-org <username>
    ```

## Common Salesforce CLI Commands

Here are common CLI commands that you'll use the most:

- `sf org login web`: Authorize an org
- `sf org open`: Open your org in a browser
- `sf org create scratch`: Create a scratch org
- `sf project deploy start`: Deploy metadata to your org
- `sf project retrieve start`: Retrieve metadata from your org
- `sf template generate <artifact>`: Scaffold new components, such as Apex classes and triggers, LWC components, Lightning apps, and more
- `sf apex <command>`: Run Apex tests, run anonymous Apex blocks, and view logs
- `sf data <command>`: Work with test data
- `sf alias <command>`: Manage org aliases
- `sf config <command>`: Configure CLI settings