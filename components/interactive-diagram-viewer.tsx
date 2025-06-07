'use client';

import type React from 'react';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Move, FileCode } from 'lucide-react';

interface InteractiveDiagramViewerProps {
  diagramUrl: string;
  isLoading?: boolean;
  onError?: () => void;
  className?: string;
  darkMode?: boolean;
}

export default function InteractiveDiagramViewer({
  diagramUrl,
  isLoading = false,
  onError,
  className = '',
  darkMode = false,
}: InteractiveDiagramViewerProps) {
  const [scale, setScale] = useState(0.64); // Start at 80% zoom
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left mouse button
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
        e.preventDefault();
      }
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Disable scroll-to-zoom: only prevent default scrolling
    e.preventDefault();
  }, []);

  // Touch events for mobile support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        });
      }
    },
    [position],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
        e.preventDefault();
      }
    },
    [isDragging, dragStart],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Simple fit to screen function that just centers the diagram
  const fitDiagramToScreen = useCallback(() => {
    setScale(0.64); // Always set to 80% zoom
    setPosition({ x: 0, y: 0 }); // Center the diagram
  }, []);

  // Reset position and fit when diagram changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    // We'll fit the diagram after the image loads
  }, [diagramUrl]);

  // Handle image load to fit diagram
  const handleImageLoad = useCallback(() => {
    fitDiagramToScreen();
    if (onError) onError();
  }, [fitDiagramToScreen, onError]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => fitDiagramToScreen();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitDiagramToScreen]);

  if (isLoading) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!diagramUrl) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-background ${className}`}>
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary">
            <FileCode className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No diagram to display
          </h3>
          <p className="text-muted-foreground mb-6">
            Enter Mermaid code in the editor to generate a diagram
          </p>
          <div className="text-left text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-dashed border-border font-mono space-y-2">
            <p># Try this example:</p>
            <p>graph TD;</p>
            <p className="ml-4">A[Start] --> B[Your Diagram]</p>
            <p className="ml-4">B --> C[Get Creative!]</p>
            <p className="ml-4">C --> D[Customize Me]</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Need help? Check out the <a href="https://mermaid.js.org/intro/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mermaid documentation</a>
          </p>
        </div>
      </div>
    );
  }

  // Calculate dot matrix position based on scale and position
  const dotMatrixStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
    backgroundImage:
      'radial-gradient(circle, currentColor 1px, transparent 1px)',
    backgroundSize: `${20 * scale}px ${20 * scale}px`,
    backgroundPosition: `${position.x}px ${position.y}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    pointerEvents: 'none' as const,
    opacity: 0.2,
  };

  return (
    <div className={`relative w-full h-full overflow-hidden`}>
      {/* Dot Matrix Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: `${position.x}px ${position.y}px`,
          opacity: darkMode ? 0.05 : 0.1,
        }}
      />

      {/* Controls */}
      <div className="absolute top-4 right-16 z-10 flex gap-2 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm border dark:bg-white/10 dark:text-white dark:border-none">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-5 w-5 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-5 w-5 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-5 w-5 p-0"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 z-10 dark:bg-white/10 dark:text-white dark:border-none backdrop-blur-sm rounded-md px-2 py-1.5 text-xs font-mono shadow-sm border">
        {Math.round(scale * 100)}%
      </div>

      {/* Pan hint */}
      {scale > 1 && (
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-muted-foreground shadow-sm border flex items-center gap-1">
          <Move className="h-3 w-3" />
          Drag to pan
        </div>
      )}

      {/* Diagram container */}
      <div
        ref={containerRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default',
        }}
      >
        <div
          className="h-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            ref={imageRef}
            src={diagramUrl}
            alt="Mermaid Diagram"
            className="max-w-none max-h-none"
            onError={onError}
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
