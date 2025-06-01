'use client';

import type React from 'react';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Move, FileCode } from 'lucide-react';

interface InteractiveDiagramViewerProps {
  diagramUrl: string;
  isLoading: boolean;
  onError: () => void;
  className?: string;
}

export default function InteractiveDiagramViewer({
  diagramUrl,
  isLoading,
  onError,
}: InteractiveDiagramViewerProps) {
  const [scale, setScale] = useState(0.25); // Start at 25% zoom
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
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
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
    setScale(0.25); // Always set to 25% zoom
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
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Rendering diagram...</span>
        </div>
      </div>
    );
  }

  if (!diagramUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <FileCode className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No diagram to display
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter Mermaid code to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden`}>
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm border dark:bg-white/90">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 w-8 p-0"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-mono shadow-sm border">
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
            src={diagramUrl || '/placeholder.svg'}
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
