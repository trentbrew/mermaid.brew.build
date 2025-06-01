"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Download, Copy, FileCode, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import InteractiveDiagramViewer from "@/components/interactive-diagram-viewer"

const encodeMermaidCode = (code: string) => {
  // URL encode the Mermaid code directly for better readability
  return encodeURIComponent(code)
}

const decodeMermaidCode = (encoded: string) => {
  try {
    return decodeURIComponent(encoded)
  } catch (e) {
    return null
  }
}

export default function MermaidEditor() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get initial code from URL hash or query param (for backward compatibility)
  const getInitialCode = () => {
    if (typeof window === 'undefined') return ''
    
    // First try to get from hash
    if (window.location.hash) {
      try {
        const hash = window.location.hash.substring(1) // Remove the '#'
        if (!hash) return ''
        const decoded = decodeURIComponent(hash)
        if (decoded) return decoded
      } catch (e) {
        console.error('Error decoding hash:', e)
      }
    }
    
    // Fallback to query param (for backward compatibility)
    const codeParam = searchParams.get('code')
    if (codeParam) {
      try {
        const decoded = decodeURIComponent(codeParam)
        if (decoded) return decoded
      } catch (e) {
        console.error('Error decoding code param:', e)
      }
    }
    return `graph TD;
    A["Start"] --> B["Process"];
    B --> C["Decision"];
    C -->|"Yes"| D["Action 1"];
    C -->|"No"| E["Action 2"];
    D --> F["End"];
    E --> F;`
  }

  const [mermaidCode, setMermaidCode] = useState<string>(getInitialCode)
  const [diagramType, setDiagramType] = useState<string>("flowchart")
  const [isRendering, setIsRendering] = useState<boolean>(false)
  const [diagramUrl, setDiagramUrl] = useState<string>("")
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
  })

  const updateUrlWithCode = (code: string) => {
    if (typeof window === 'undefined') return
    try {
      const encoded = encodeURIComponent(code)
      const newUrl = `${window.origin}${pathname}#${encoded}`
      window.history.replaceState({}, '', newUrl)
    } catch (e) {
      console.error('Error updating URL:', e)
    }
  }

  const generateDiagramUrl = (code: string) => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(code)))
      return `https://mermaid.ink/svg/${encoded}`
    } catch (error) {
      console.error("Error encoding diagram:", error)
      return ""
    }
  }

  useEffect(() => {
    const renderDiagram = () => {
      setIsRendering(true)
      try {
        const url = generateDiagramUrl(mermaidCode)
        setDiagramUrl(url)
      } catch (error) {
        console.error("Error generating diagram:", error)
        toast({
          title: "Rendering Error",
          description: "There was an error generating your diagram. Please check your syntax.",
          variant: "destructive",
        })
      } finally {
        setTimeout(() => setIsRendering(false), 500)
      }
    }

    const timer = setTimeout(renderDiagram, 500)
    return () => clearTimeout(timer)
  }, [mermaidCode, toast])

  const handleExampleChange = (type: string) => {
    setDiagramType(type)
    const newCode = examples[type]
    setMermaidCode(newCode)
    updateUrlWithCode(newCode)
  }

  const downloadSVG = async () => {
    try {
      const response = await fetch(diagramUrl)
      const svgText = await response.text()
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mermaid-diagram-${new Date().getTime()}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Download Complete",
        description: "Your SVG diagram has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download the diagram. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mermaidCode)
    toast({
      title: "Copied to Clipboard",
      description: "Mermaid code has been copied to your clipboard.",
    })
  }

  const refreshDiagram = () => {
    setIsRendering(true)
    const url = generateDiagramUrl(mermaidCode)
    setDiagramUrl(url + `?t=${Date.now()}`)
    setTimeout(() => setIsRendering(false), 500)
  }

  const handleDiagramError = () => {
    toast({
      title: "Rendering Error",
      description: "Failed to render diagram. Please check your Mermaid syntax.",
      variant: "destructive",
    })
  }

  // Update URL when mermaidCode changes
  useEffect(() => {
    // Skip initial render to avoid overwriting URL with default code
    const isInitialRender = !searchParams.get('code') && !window.location.hash
    if (isInitialRender) return
    
    const timer = setTimeout(() => {
      updateUrlWithCode(mermaidCode)
    }, 500)
    return () => clearTimeout(timer)
  }, [mermaidCode])

  return (
    <div className="w-full h-screen bg-white">
      <InteractiveDiagramViewer 
        diagramUrl={diagramUrl} 
        isLoading={isRendering} 
        onError={handleDiagramError} 
        className="w-full h-full"
      />
    </div>
  )
}
