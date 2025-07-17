# Simple Web App Template

A modern, feature-rich Next.js application that provides text conversion utilities with a beautiful, responsive interface. Built with cutting-edge technologies and designed for extensibility.

## 🔧 Features & Functionality

- **Text Conversion Tools**: Multiple text transformation utilities including:
  - Uppercase text converter
  - Reverse text converter
  - Extensible converter system for adding new transformations
- **Modern UI/UX**: Clean, responsive design with multiple theme options
- **Theme System**: Multiple beautiful themes including:
  - Pastel Dreams (default)
  - Neo Brutalism
  - Graphite
  - Vintage Paper
  - Notebook
  - Caffeine
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Form Validation**: Robust form handling with Zod schema validation
- **Toast Notifications**: User-friendly feedback system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🧩 Project Structure

### Pages & Routes
- **Home Page** (`/`): Landing page with hero section and feature showcase
- **Convert Hub** (`/convert`): Overview of all available text converters
- **Individual Converters** (`/convert/[converter]`): Dynamic routes for each converter tool
- **Feature Page** (`/feature`): Additional features showcase

### Key Components
- **Navigation**: Responsive navbar with mobile menu and theme toggle
- **Text Converter**: Reusable converter interface with input/output panels
- **Breadcrumbs**: Dynamic navigation breadcrumbs
- **Theme Provider**: Context-based theme management
- **UI Components**: Comprehensive shadcn/ui component library

### Hooks & Utilities
- **useFormHandler**: Custom hook for form state management and validation
- **Converter System**: Modular text transformation engine
- **Theme Management**: Next-themes integration for seamless theme switching

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.1 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | ^5 | Type safety and developer experience |
| **Tailwind CSS** | ^4 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Modern component library |
| **Radix UI** | Latest | Accessible component primitives |
| **Zod** | ^4.0.5 | Schema validation |
| **next-themes** | ^0.4.6 | Theme management |
| **React Toastify** | ^11.0.5 | Toast notifications |
| **Lucide React** | ^0.525.0 | Icon library |

## ⚙️ Version Information

- **Node.js**: Recommended 18+ 
- **Package Manager**: npm, yarn, pnpm, or bun supported
- **Next.js**: 15.4.1 with Turbopack for fast development
- **React**: 19.1.0 (latest stable)

## ✏️ Customization & Extension

### Adding New Text Converters

1. **Define the converter** in `src/lib/converters.ts`:
```typescript
export const converters: Record<string, TextConverterDefinition> = {
  // ... existing converters
  "your-converter": {
    name: "Your Converter",
    description: "Description of what it does",
    convert: (input: string) => {
      // Your transformation logic
      return transformedText;
    },
  },
};
```

2. **Add navigation link** in `src/config/nav-links.ts`:
```typescript
{
  href: "/convert/your-converter",
  label: "Your Converter",
  icon: YourIcon,
}
```

3. **The route will be automatically available** at `/convert/your-converter`

### Customizing Themes

1. **Create a new theme file** in `src/themes/your-theme.css`
2. **Define CSS custom properties** for colors, fonts, shadows, etc.
3. **Import the theme** in `src/app/globals.css`

### Adding New UI Components

The project uses shadcn/ui. Add new components with:
```bash
npx shadcn@latest add [component-name]
```

## 🚀 Installation & Usage

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd text-converter-playground
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 📁 Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (root)/            # Route group for main pages
│   │   ├── convert/       # Text converter pages
│   │   └── feature/       # Feature showcase
│   ├── globals.css        # Global styles and theme imports
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation components
│   ├── text-converter.tsx # Main converter interface
│   └── theme-provider.tsx # Theme context provider
├── config/               # Configuration files
│   └── nav-links.ts      # Navigation configuration
├── hooks/                # Custom React hooks
│   └── use-form-handler.ts # Form state management
├── interface/            # TypeScript interfaces
├── lib/                  # Utility libraries
│   ├── converters.ts     # Text conversion logic
│   └── utils.ts          # Helper utilities
├── schemas/              # Zod validation schemas
├── themes/               # CSS theme definitions
└── types/                # TypeScript type definitions
```

## 💡 Development Tips

### Code Organization
- **Components**: Keep components small and focused on single responsibilities
- **Hooks**: Extract reusable logic into custom hooks
- **Types**: Define interfaces in dedicated files for better maintainability
- **Validation**: Use Zod schemas for all form validation

### Performance Considerations
- The app uses Next.js 15 with Turbopack for fast development builds
- Components are optimized for tree-shaking
- CSS is utility-first with Tailwind for minimal bundle size

### Accessibility
- All UI components are built on Radix UI primitives for accessibility
- Proper ARIA labels and keyboard navigation support
- Color contrast ratios meet WCAG guidelines across all themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**