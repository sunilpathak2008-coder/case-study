# Social Support Application with AI Assistance

This Angular application is designed to help users apply for social support, featuring a multi-step wizard, AI-powered text suggestions, and multilingual support (English/Arabic).

## Features
- Multi-step wizard for personal, family/financial, and situation information
- AI assistance for writing situation descriptions
- Responsive UI with Angular Material
- Language switcher (English/Arabic)
- Form validation and error handling
- Success feedback via snackbar
- Local storage for progress persistence
- Unit tests with high coverage

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Angular CLI

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```
Visit `http://localhost:4200` in your browser.

### Running Tests
```bash
npm test
```
For code coverage:
```bash
npm run test:coverage
```

## Project Structure
- `src/app/features/wizard/` — Wizard components and dialog
- `src/app/core/services/` — AI and storage services
- `src/assets/i18n/` — Translation files (`en.json`, `ar.json`)
- `src/app/app.component.*` — Main app shell and layout

## Technologies Used
- Angular 16
- Angular Material
- ngx-translate
- RxJS
- Jasmine/Karma (testing)

## Customization
- Add more languages by updating `src/assets/i18n/`
- Adjust wizard steps/components in `src/app/features/wizard/`
- Update AI prompts in translation files

## License
MIT
