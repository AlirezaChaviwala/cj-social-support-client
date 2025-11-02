# Social Support Application Portal

A responsive, multi-language (English/Arabic) government-style social support portal with a 3-step wizard form and AI-assisted writing capabilities.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)
- **OpenAI API Key** (optional - for AI assistance feature)

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd cj-social-support-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key (if you want to use AI assistance):

   ```env
   VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

   > **Note**: The AI assistance feature is optional. If you don't provide an API key, the application will use fallback template text instead.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port Vite assigns).

5. **Build for production**

   ```bash
   npm run build
   ```

   Preview the production build:

   ```bash
   npm run preview
   ```

## 📋 Features

- ✅ **3-Step Wizard Form**: Personal Information → Family & Financial Info → Situation Descriptions
- ✅ **Progress Bar**: Visual progress indicator with step tracking
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Local Storage Persistence**: Auto-saves progress, refresh-safe
- ✅ **AI-Assisted Writing**: "Help Me Write" button for text fields (OpenAI GPT-3.5-turbo)
- ✅ **Bilingual Support**: English / Arabic with full RTL support
- ✅ **Form Validation**: Real-time validation with localized error messages
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Step Completion Tracking**: Prevents navigation to uncompleted steps
- ✅ **Dynamic Geographic Data**: Countries, states, and cities using `country-state-city` package

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **UI Library**: Ant Design 5
- **Form Handling**: React Hook Form with controlled components
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Internationalization**: React-i18next (English + Arabic with RTL)
- **API Calls**: Axios
- **Date Handling**: Day.js
- **Geographic Data**: country-state-city npm package

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIAssistModal.tsx       # Modal for AI suggestions
│   ├── HelpMeWriteButton.tsx   # Button triggering AI assistance
│   └── Wizard.tsx              # Main wizard container with progress bar
├── domain/             # Type definitions and domain models
│   └── application.ts          # Application data types, step enums
├── hooks/              # Custom React hooks
│   └── useStepNavigation.ts    # Centralized step navigation logic
├── i18n/               # Internationalization
│   ├── index.ts               # i18n configuration
│   └── locales/               # Translation files
│       ├── en.json            # English translations
│       └── ar.json            # Arabic translations
├── pages/              # Page components (wizard steps)
│   ├── PersonalInformation.tsx
│   ├── FamilyAndFinancialInformation.tsx
│   ├── SituationInformation.tsx
│   └── Submit.tsx
├── routes/             # Routing configuration
│   └── AppRouter.tsx
├── services/           # Business logic and API services
│   ├── applicationRepository.ts  # LocalStorage persistence
│   ├── geoDataService.ts         # Geographic data from npm package
│   └── openAIService.ts          # OpenAI API integration
├── store/              # Redux store
│   ├── index.ts                # Store configuration
│   ├── applicationSlice.ts     # Application data state
│   └── uiSlice.ts              # UI state (language, theme, etc.)
└── utils/              # Utility functions
    ├── errorHelper.ts          # Validation error message helper
    ├── routerHelper.ts         # Router utilities
    └── stepConfig.ts           # Wizard step configuration
```

### Key Architectural Decisions

#### 1. **State Management Strategy**

- **Redux Toolkit** for global application state (form data, current step, completed steps)
- **React Hook Form** for form state management (validation, field-level state)
- **LocalStorage** for persistence via `applicationRepository` service
- **Separation of Concerns**: UI state in `uiSlice`, application data in `applicationSlice`

**Why?**

- Redux provides centralized state accessible across components
- React Hook Form handles complex form validation efficiently
- LocalStorage ensures data persistence across page refreshes

#### 2. **Form Validation Pattern**

- **React Hook Form** with `Controller` for Ant Design components
- **Controlled components** for all Ant Design inputs (Select, DatePicker, Radio.Group)
- **Uncontrolled components** (`register`) for simple HTML inputs
- **Custom `getErrorHelp` utility** for localized, dynamic error messages

**Why?**

- Ant Design components require `Controller` to work with React Hook Form
- Centralized error handling with i18n support
- Consistent validation rules across all steps

#### 3. **Step Navigation & Progress Tracking**

- **Centralized step configuration** in `stepConfig.ts`
- **Step completion tracking** in Redux (`completedSteps` array)
- **Disabled forward navigation** until current step is completed
- **Progress bar** calculates percentage based on current step

**Why?**

- Prevents users from skipping required steps
- Maintains data integrity
- Provides clear visual feedback

#### 4. **AI Service Design**

- **Service layer separation**: `openAIService.ts` handles only API calls
- **UI layer handles fallbacks**: `AIAssistModal.tsx` manages error states and fallback text
- **Context-aware fallbacks**: Fallback text based on field type (financial, employment, reason)
- **Graceful degradation**: App works without API key using template suggestions

**Why?**

- Clean separation of concerns
- Better error handling at UI level
- Field-specific fallback messages improve UX
- No hard dependency on external service

#### 5. **Internationalization (i18n)**

- **React-i18next** with separate locale files
- **RTL support** for Arabic (automatic `dir` attribute management)
- **Dynamic translations** in validation errors and form labels
- **Centralized translation keys** in JSON files

**Why?**

- Industry-standard i18n solution
- Easy to add new languages
- Consistent translation management

#### 6. **Geographic Data**

- **`country-state-city` npm package** instead of external API
- **Local data** ensures consistency and offline capability
- **Service abstraction** in `geoDataService.ts` for easy replacement

**Why?**

- No API dependency or rate limits
- Faster loading (no network requests)
- More reliable (no API downtime concerns)

#### 7. **Accessibility (A11y)**

- **ARIA attributes**: `aria-label`, `aria-describedby`, `aria-invalid`, `aria-required`
- **Keyboard navigation**: Tab, Enter, Escape key support
- **Focus management**: Auto-focus on modals and form inputs
- **Screen reader support**: `role`, `aria-live` for dynamic content

**Why?**

- Legal compliance (WCAG guidelines)
- Better UX for users with disabilities
- Improves overall usability

#### 8. **Data Persistence**

- **Auto-save to LocalStorage** on every Redux state update
- **Load on app initialization** from LocalStorage
- **Repository pattern** (`applicationRepository.ts`) for abstraction

**Why?**

- Users don't lose progress on refresh
- Simple, no backend required
- Easy to migrate to backend API later

## 🔧 Key Implementation Details

### Form Data Binding

The application uses a hybrid approach:

- **React Hook Form's `reset()`** to sync form with Redux state on mount/navigation
- **`useRef` to track previous Redux state** to avoid unnecessary re-initialization during user input
- **`Controller` components** for Ant Design inputs to ensure proper two-way binding

### Step Completion Enforcement

```typescript
// Completed steps tracked in Redux
completedSteps: StepType[]

// Forward navigation blocked until current step completed
// Backward navigation always allowed
// Navigation to already-completed steps allowed
```

### Fallback Text Strategy

1. **Field-specific fallbacks**: Based on `fieldLabel` prop (e.g., "Current Financial Situation")
2. **Generic fallback**: If field type not recognized
3. **Always available**: Even without OpenAI API key

### Localization Pattern

```typescript
// All user-facing text uses translation function
t("form.fieldName", { defaultValue: "Fallback text" });

// Dynamic error messages
getErrorHelp(fieldName, error, t);
```

## 🚀 Improvements & Future Enhancements

### Completed

- ✅ Step completion tracking
- ✅ Progress bar implementation
- ✅ Fallback text for AI failures
- ✅ Accessibility improvements
- ✅ Dynamic geographic data
- ✅ Comprehensive form validation

### Potential Future Enhancements

1. **Backend Integration**

   - Replace LocalStorage with API calls
   - Add user authentication
   - Server-side validation

2. **Enhanced AI Features**

   - Multiple AI model options
   - Context-aware suggestions based on previous form entries
   - Multi-language AI responses

3. **Additional Features**

   - File uploads (documents, photos)
   - Multi-application management
   - Application status tracking
   - Email notifications

4. **Testing**

   - Unit tests for services and utilities
   - Integration tests for form flows
   - E2E tests with Playwright/Cypress

5. **Performance**

   - Code splitting for pages
   - Lazy loading for geographic data
   - Memoization for expensive computations

6. **Accessibility**
   - Enhanced screen reader announcements
   - High contrast mode
   - Reduced motion support

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is an assessment/project. For questions or improvements, please refer to the project maintainer.

## 📄 License

This project is for assessment purposes.

---
