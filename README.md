# Sorachio Chat

<p align="center">
  <img src="public/logo.png" alt="Sorachio Logo" width="600"/>
</p>
  
<p align="center">
  <a href="https://sorachio.netlify.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Sorachio_AI-blue?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://sorachio.netlify.app">
    <img src="https://img.shields.io/badge/✨_Try_Now-Available_24/7-green?style=for-the-badge" alt="Try Now"/>
  </a>
</p>

**Sorachio Chat** is a sophisticated web-based AI chatbot application with **multimodal** capabilities, enabling users to interact through text, voice, and images. Built with AI assistance using [Lovable.dev](https://lovable.dev), powered by OpenRouter API backend, and enhanced with real-time web browsing capabilities via Brave Search API. The application features an elegant, minimalist design with premium UI aesthetics and is securely deployed through Netlify.

## 🎯 About Sorachio

Sorachio represents an experimental approach to developing a comprehensive personal AI assistant that bridges the gap between traditional chatbots and advanced multimodal AI systems. The project demonstrates cutting-edge capabilities including:

- **Multimodal Understanding**: Processing text, voice, and visual inputs seamlessly
- **Real-time Information Access**: Live web browsing for current information
- **Natural Conversation**: Emotionally aware personality designed by 1dle Labs with Indonesian language support
- **Technical Excellence**: Modern web technologies with serverless architecture

making advanced AI technology accessible across various interaction modalities.

## ✨ Key Features

### 🤖 AI Assistant - Sorachio
- **Natural & Emotionally Aware**: Friendly AI assistant developed by 1dle Labs with smooth, honest, and enjoyable conversational abilities
- **Indonesian Language Support**: Fluent conversations in Indonesian language
- **Multimodal Chat**: Send text, images, and voice inputs (supports GPT-4 Vision, Claude 3, and other LLM models)
- **Voice Input**: Real-time speech-to-text conversion with visual feedback during recording

### 🌐 Advanced Web Capabilities
- **Real-time Web Browsing**: Powered by Brave Search API for live information retrieval from the internet
- **Information Processing**: Ability to search, analyze, and present current web-based information
- **Context-Aware Responses**: Combines AI knowledge with real-time data for comprehensive answers

### 💬 Chat Management
- **Sidebar Chat History**: View, organize, and manage chat history with intuitive navigation
- **Multiple Conversations**: Handle multiple simultaneous conversations with easy switching
- **Auto-generated Titles**: Intelligent chat titles generated based on conversation content
- **Export Functionality**: Export chat sessions in `.json` or `.txt` formats for documentation
- **Persistent Storage**: Conversations saved securely in browser storage

### 🎨 User Interface & Experience
- **Elegant Minimalist Design**: Sophisticated black and white color scheme with premium aesthetics
- **Responsive Design**: Seamlessly optimized for both desktop and mobile devices
- **Mobile-Optimized Interface**: Adaptive sidebar and touch-friendly controls
- **Smooth Animations**: Fluid transitions, loading indicators, and interactive feedback
- **Image Preview**: Built-in image preview and processing capabilities

### ⚡ Performance & Security
- **Serverless Backend**: Secure API requests through Netlify Functions architecture
- **Image Compression**: Automatic image optimization for enhanced performance
- **Comprehensive Error Handling**: Robust error management with informative user feedback
- **Timeout Management**: Smart handling of heavy requests and processing delays
- **CORS Security**: Proper cross-origin resource sharing implementation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State Management**: React Hooks (useState, useCallback, custom hooks)
- **Backend**: Netlify Functions (serverless architecture)
- **AI Integration**: OpenRouter API supporting multiple multimodal LLM models
- **Search Integration**: Brave Search API for real-time web browsing
- **Speech Recognition**: Web Speech API for voice input processing
- **Image Processing**: Canvas API for automatic image compression
- **Deployment Platform**: Netlify with continuous deployment

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v16+) or **Bun** installed on your system.

### Installation

```bash
# Clone the repository
git clone https://github.com/IzzulGod/Sorachio-Chat
cd Sorachio-Chat

# Install dependencies
npm install     # or: bun install

# Start development server
npm run dev     # or: bun dev
```

Open your browser at `http://localhost:5173` to access the application.

### Environment Setup

Configure the following environment variables in Netlify for backend functionality:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
BRAVE_API_KEY=your_brave_api_key_here
```

### Build for Production

```bash
npm run build     # or: bun run build
npm run preview   # Preview production build locally
```

## 📦 Available Scripts

- `dev` – Start local development server
- `build` – Build optimized production bundle
- `preview` – Preview production build locally
- `lint` – Run ESLint for code quality checks

## 💻 User Interface Preview

**Welcome Screen:**
```
Hello! I'm Sorachio 👋  
How can I assist you today?
[ ⭕ Sorachio Logo ]
```

**Conversation Example:**
```
👤: Hi Sora, what's the latest news about AI?  
🤖: Hello! Let me search for the latest AI news for you...
    [Searches web and provides current information]
```

## 🎯 Advanced Features

### Image Processing
- **Automatic Resizing**: Images optimized to maximum 800px width
- **Smart Compression**: JPEG compression at 60% quality for optimal performance
- **Format Support**: Compatible with JPG, PNG, and other common image formats
- **Real-time Preview**: Instant image preview before sending

### Voice Recognition
- **Multi-language Support**: Speech recognition in multiple languages
- **Real-time Processing**: Live speech-to-text conversion
- **Visual Feedback**: Recording indicators and status updates
- **Error Recovery**: Robust handling of speech recognition failures

### Web Browsing Integration
- **Live Search**: Real-time information retrieval from the internet
- **Context Integration**: Seamlessly combines web data with AI responses
- **Source Attribution**: Proper citation of web sources in responses
- **Smart Filtering**: Relevant information extraction from search results

### Mobile Experience
- **Touch Optimization**: Finger-friendly interface design
- **Adaptive Layout**: Dynamic sidebar sizing (50% screen width on mobile)
- **Keyboard Awareness**: Smart scrolling during text input
- **Orientation Support**: Seamless portrait/landscape transitions

## ☁️ Deployment & Architecture

### Netlify Functions
- `/netlify/functions/chat.js` – Main chat API endpoint
- **Environment Management**: Secure API key handling
- **CORS Configuration**: Proper cross-origin request handling
- **Error Logging**: Comprehensive backend error tracking

### Serverless Benefits
- **Scalability**: Automatic scaling based on demand
- **Security**: API keys protected server-side
- **Performance**: Optimized cold start times
- **Cost Efficiency**: Pay-per-use serverless model

## 🔧 Customization

### Changing AI Model
Modify the model configuration in `src/hooks/useChat.ts`:

```typescript
const apiPayload = {
  model: 'meta-llama/llama-4-maverick:free', // Replace with preferred model
  messages: messages,
  // ... other configurations
};
```

### Customizing AI Personality
Edit the system prompt in `useChat.ts`:

```typescript
{
  role: 'system',
  content: 'You are Sorachio, a friendly and helpful AI assistant developed by 1dle Labs...' // Customize here
}
```

### UI Theme Customization
Modify colors and styling in `tailwind.config.js` and component files to match your brand.

## 🧠 How It Works

1. **Input Processing**: User submits input (text, image, or voice)
2. **Client-side Processing**: 
   - Voice converted to text via Web Speech API
   - Images compressed using Canvas API
   - Text preprocessed for optimal AI interaction
3. **Secure API Call**: Frontend sends request to Netlify serverless function
4. **AI & Web Integration**: 
   - Serverless function routes to OpenRouter API
   - Optional web search via Brave Search API for current information
5. **Response Generation**: AI processes multimodal input and generates contextual response
6. **UI Update**: Response displayed with proper formatting and error handling
7. **Session Management**: Chat history updated and persisted locally

## 🤝 Contributing

We welcome contributions to improve Sorachio Chat! Here's how you can help:

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add proper error handling for new features
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
