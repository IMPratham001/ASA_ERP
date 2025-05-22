
import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    async function startScanning() {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;
        
        if (selectedDeviceId && videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                onScan(result.getText());
              }
              if (err && onError) {
                onError(err);
              }
            }
          );
        }
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    }

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, [onScan, onError]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        className="w-full rounded-lg border border-gray-200"
      />
    </div>
  );
}
