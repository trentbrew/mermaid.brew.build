'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Copy, ExternalLink, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InteractiveDiagramViewer from '@/components/interactive-diagram-viewer';

const encodeMermaidCode = (code: string) => {
  // URL encode the Mermaid code directly for better readability
  return encodeURIComponent(code);
};

const decodeMermaidCode = (encoded: string) => {
  try {
    return decodeURIComponent(encoded);
  } catch (e) {
    return null;
  }
};

export default function MermaidEditor() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial state from URL
  const getInitialState = () => {
    if (typeof window === 'undefined') return { code: '', darkMode: false };

    let code = '';
    let darkMode = searchParams.get('dark') === '1';

    // Get code from hash
    if (window.location.hash) {
      try {
        const hash = window.location.hash.substring(1); // Remove the '#'
        if (hash) {
          const decoded = decodeURIComponent(hash);
          if (decoded) code = decoded;
        }
      } catch (e) {
        console.error('Error decoding hash:', e);
      }
    }

    // Fallback to query param (for backward compatibility)
    if (!code) {
      const codeParam = searchParams.get('code');
      if (codeParam) {
        try {
          const decoded = decodeURIComponent(codeParam);
          if (decoded) code = decoded;
        } catch (e) {
          console.error('Error decoding code param:', e);
        }
      }
    }

    return { code, darkMode };
  };

  const { code: initialCode, darkMode: initialDarkMode } = getInitialState();
  const [mermaidCode, setMermaidCode] = useState<string>(initialCode || '');
  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
  const [diagramType, setDiagramType] = useState<string>('flowchart');
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [diagramUrl, setDiagramUrl] = useState<string>('');
  const [examples, setExamples] = useState<Record<string, string>>({
    flowchart: `graph TD;
    A["Start"] --> B["Process"];
    B --> C["Decision"];
    C -->|"Yes"| D["Action 1"];
    C -->|"No"| E["Action 2"];
    D --> F["End"];
    E --> F;`,
    sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
    classDiagram: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`,
    gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2023-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2023-01-12, 12d
    another task     :24d`,
    er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    complex: `graph TB
    subgraph "Frontend"
        A[React App] --> B[Component Library]
        A --> C[State Management]
        B --> D[UI Components]
        C --> E[Redux Store]
    end

    subgraph "Backend"
        F[API Gateway] --> G[Microservices]
        G --> H[User Service]
        G --> I[Order Service]
        G --> J[Payment Service]
    end

    subgraph "Database"
        K[(User DB)] --> H
        L[(Order DB)] --> I
        M[(Payment DB)] --> J
    end

    A --> F

    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#e8f5e8
    style M fill:#e8f5e8`,
  });

  // Update URL with current state
  const updateUrl = useCallback(
    (newCode?: string, newDarkMode?: boolean) => {
      if (typeof window === 'undefined') return;

      try {
        const codeToUse = newCode !== undefined ? newCode : mermaidCode;
        const darkModeToUse =
          newDarkMode !== undefined ? newDarkMode : darkMode;

        const params = new URLSearchParams();
        if (darkModeToUse) params.set('dark', '1');
        const queryString = params.toString();

        // Only encode the Mermaid code in the hash
        const hash = codeToUse ? `#${encodeURIComponent(codeToUse)}` : '';

        // Build URL with query params and hash
        const newUrl = `${window.origin}${pathname}${
          queryString ? `?${queryString}` : ''
        }${hash}`;

        window.history.replaceState({}, '', newUrl);
      } catch (e) {
        console.error('Error updating URL:', e);
      }
    },
    [mermaidCode, darkMode, pathname],
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateUrl(undefined, newDarkMode);
  };

  const generateDiagramUrl = (code: string) => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(code)));
      return `https://mermaid.ink/svg/${encoded}`;
    } catch (error) {
      console.error('Error encoding diagram:', error);
      return '';
    }
  };

  useEffect(() => {
    const renderDiagram = () => {
      setIsRendering(true);
      try {
        const url = generateDiagramUrl(mermaidCode);
        setDiagramUrl(url);
      } catch (error) {
        console.error('Error generating diagram:', error);
        toast({
          title: 'Rendering Error',
          description:
            'There was an error generating your diagram. Please check your syntax.',
          variant: 'destructive',
        });
      } finally {
        setTimeout(() => setIsRendering(false), 500);
      }
    };

    const timer = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timer);
  }, [mermaidCode, toast]);

  const handleExampleChange = (type: string) => {
    setDiagramType(type);
    const newCode = examples[type];
    setMermaidCode(newCode);
    updateUrlWithCode(newCode);
  };

  const downloadSVG = async () => {
    try {
      const response = await fetch(diagramUrl);
      const svgText = await response.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mermaid-diagram-${new Date().getTime()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download Complete',
        description: 'Your SVG diagram has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Download Error',
        description: 'Failed to download the diagram. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mermaidCode);
    toast({
      title: 'Copied to Clipboard',
      description: 'Mermaid code has been copied to your clipboard.',
    });
  };

  const refreshDiagram = () => {
    setIsRendering(true);
    const url = generateDiagramUrl(mermaidCode);
    setDiagramUrl(url + `?t=${Date.now()}`);
    setTimeout(() => setIsRendering(false), 500);
  };

  const handleDiagramError = () => {
    toast({
      title: 'Rendering Error',
      description:
        'Failed to render diagram. Please check your Mermaid syntax.',
      variant: 'destructive',
    });
  };

  // Update URL when mermaidCode changes
  useEffect(() => {
    // Skip initial render to avoid overwriting URL with default code
    const isInitialRender = !searchParams.get('code') && !window.location.hash;
    if (isInitialRender) return;

    const timer = setTimeout(() => {
      updateUrl(mermaidCode, darkMode);
    }, 500);
    return () => clearTimeout(timer);
  }, [mermaidCode, darkMode]);

  // Copy current URL to clipboard
  const copyLink = () => {
    const params = new URLSearchParams();
    if (darkMode) params.set('dark', '1');
    const queryString = params.toString();

    const url = `${window.location.origin}${pathname}${
      queryString ? `?${queryString}` : ''
    }${mermaidCode ? `#${encodeURIComponent(mermaidCode)}` : ''}`;

    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied to clipboard',
      description: 'Share this link to let others view your diagram',
    });
  };

  // Open in new tab
  const openInNewTab = () => {
    const params = new URLSearchParams();
    if (darkMode) params.set('dark', '1');
    const queryString = params.toString();

    const url = `${window.location.origin}${pathname}${
      queryString ? `?${queryString}` : ''
    }${mermaidCode ? `#${encodeURIComponent(mermaidCode)}` : ''}`;

    window.open(url, '_blank');
  };

  return (
    <div
      className={`w-full h-screen ${
        darkMode ? 'dark bg-[#212121]' : 'bg-white'
      }`}
    >
      <div className="absolute bottom-4 left-4 z-50 flex gap-2 [&_button]:bg-white [&_button]:dark:bg-white [&_button]:dark:text-gray-900 [&_button]:dark:hover:bg-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="h-8 w-8 p-0"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="h-8"
          title="Copy link"
        >
          <Copy className="h-4 w-4 mr-2" /> Copy Link
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openInNewTab}
          className="h-8"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4 mr-2" /> Open
        </Button>
      </div>
      <InteractiveDiagramViewer
        diagramUrl={diagramUrl}
        isLoading={isRendering}
        onError={handleDiagramError}
        className="w-full h-full"
      />
    </div>
  );
}
