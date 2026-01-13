# Changelog

All notable changes to the EDG Frontend Template project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Error Boundary component for graceful error handling
- Authentication system implementation
- Testing suite with Vitest + Testing Library

---

## [3.0.0] - 2025-12-15

### Breaking Changes
- **Removed atomic components layer** - `ThemedText`, `ThemedSurface`, `ThemedImage`, `ThemedBorder`, `ThemedShadow` components have been removed
- Components now use Tailwind classes directly with CSS variables

### Removed
- `src/core/components/atomic/` folder and all its contents
- `ThemedText` component - use `<span className="text-text-primary">` instead
- `ThemedSurface` component - use `<div className="bg-bg-primary">` instead
- `ThemedImage` component - use `useThemedImage` hook directly instead
- `ThemedBorder` component - use `border border-border-default` classes
- `ThemedShadow` component - use `shadow-themed-*` classes

### Changed
- **Theming architecture simplified** from 3 layers to 2 layers:
  - Before: CSS Variables → Tailwind Theme → Atomic Components
  - After: CSS Variables → Tailwind Theme → Direct usage
- `typography.css` now uses theme variables instead of hardcoded colors
- `Logo.tsx` refactored to use `useThemedIcon` hook directly
- All components migrated from atomic wrappers to direct Tailwind classes

### Fixed
- Vite HMR WebSocket configuration - now works with both `localhost` and custom hosts
- Removed debug Redux selector from Dashboard that was causing console warnings

### Migration Guide
```tsx
// BEFORE (with ThemedSurface)
<ThemedSurface variant="primary" borderVariant="default">
  <ThemedText variant="secondary">Content</ThemedText>
</ThemedSurface>

// AFTER (direct Tailwind classes)
<div className="bg-bg-primary border border-border-default">
  <span className="text-text-secondary">Content</span>
</div>
```

**Mapping reference:**
| Old | New |
|-----|-----|
| `<ThemedText variant="primary">` | `<span className="text-text-primary">` |
| `<ThemedText variant="secondary">` | `<span className="text-text-secondary">` |
| `<ThemedSurface variant="primary">` | `<div className="bg-bg-primary">` |
| `<ThemedSurface variant="modal">` | `<div className="bg-bg-modal">` |
| `borderVariant="default"` | `border border-border-default` |
| `<ThemedImage imageKey="icon">` | `useThemedIcon()` hook |

---

## [2.1.0] - 2025-07-24

### Added
- **API Service Infrastructure**
  - Complete HTTP client with GET, POST, PUT, PATCH, DELETE, UPLOAD methods
  - Authentication support with token management
  - Typed error handling with `ApiError` interface
  - Request/Response interceptors with timeout management
  - Environment-based configuration
  - File upload support with FormData handling

- **Info Components Suite**
  - `VersionInfo` component with app version, environment badges, and build timestamps
  - `ConnectionStatus` component with real-time backend monitoring and polling
  - `QuickLink` component with internal/external link support, icons, and badges

- **Layout Utility Components**
  - `CenteredPage` component for full viewport centering with animations
  - `CenteredSection` component for flexible section centering with icons

### Changed
- Enhanced documentation with detailed component specifications
- Improved TypeScript interfaces across all new components

---

## [2.0.0] - 2025-07-07

### Added
- **Complete Form System** (8 components + wrapper)
  - `Input` component with floating labels and validation
  - `TextArea` component with auto-resize and character counter
  - `Select` component with Radix UI integration
  - `Checkbox` component with advanced states
  - `Switch` component with iOS-style design
  - `RadioGroup` component with orientations and descriptions
  - `FormField` universal wrapper for consistent layouts
  - `Label` standalone component with semantic variants

- **UI Components Suite**
  - `Card` component with variants and theming
  - `Separator` component with orientation support
  - `Alert` component with dismissible functionality
  - Enhanced `Button` component with `loadingText` feature

- **Data Display Components**
  - `Table` component with responsive design
  - `TableLink` component for clickable table elements
  - `InfoCard` component with structured content
  - `Badge` component with color variants

- **Action Components**
  - `ActionMenu` dropdown for CRUD operations
  - `CreateAction`, `EditAction`, `DeleteAction` components
  - Integrated confirmation dialogs

### Enhanced
- **CSS System Extensions**
  - 4 semantic underline states for form components
  - Autofill override CSS for browser consistency
  - Extended theme variables for form elements

---

## [1.3.0] - 2025-06-30

### Added
- **Dual Menu System**
  - `UserMenu` component for profile management
  - `SettingsMenu` component for app configuration
  - Smart menu exclusivity (only one open at a time)

- **Enhanced UI Components**
  - `UserAvatar` component with initials and hover effects
  - `HeaderGroup` component for optimized title/subtitle spacing
  - `TitledSurface` component with fieldset-style title borders

### Changed
- **Header System Restructuring**
  - 3-zone layout: LEFT (Logo + Mobile menu), CENTER (Navigation), RIGHT (User controls)
  - Responsive behavior with conditional element visibility

---

## [1.2.0] - 2025-06-26

### Added
- **Core Layout System**
  - `MainLayout` component with grid structure and responsive behavior
  - `Header` component with logo, navigation, and user controls
  - `Sidebar` component with expandable/collapsible states
  - `Footer` component with minimal design and version info

- **Theme System Infrastructure**
  - Complete CSS custom properties for light/dark mode
  - Automatic theme switching with DOM class management
  - Theme persistence via localStorage middleware

- **Redux State Management**
  - `uiSlice` with complete UI state
  - Persistence middleware for automatic localStorage sync
  - Typed hooks and selectors

---

## [1.1.0] - 2025-06-25

### Added
- **Navigation System**
  - Route configuration with centralized definitions
  - Navigation configuration with icon mapping
  - React Router integration with typed routes

- **Base UI Components**
  - `Button` component with variants and loading states
  - `Modal` and `ConfirmModal` components
  - `Spinner` component for loading indicators

---

## [1.0.0] - 2025-06-20

### Added
- **Initial Project Setup**
  - React 18 + Vite + TypeScript foundation
  - Tailwind CSS configuration with custom theme
  - Redux Toolkit setup with persistence middleware
  - Lucide React icons integration

- **Project Structure**
  - Feature-based architecture
  - Scalable folder structure with clear separation of concerns

---

## Version Guidelines

- **Major (X.0.0)**: Breaking changes, removal of features
- **Minor (X.Y.0)**: New components, backward-compatible features
- **Patch (X.Y.Z)**: Bug fixes, documentation updates

---

**Repository**: [GitHub](https://github.com/LarisPigasse/edg-frontend-template)
