import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

export default function(props: {
  onDetected: (res: any) => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment" // or user
        },
        target: ref.current
      },
      locate: false,
      locator: {
        patchSize: "medium",
        halfSample: false,
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
      },
      numOfWorkers: 8,
      decoder: {
        readers: ["ean_reader", "upc_reader"]
      },
    }, function(err: any) {
      if (err) {
        console.error("Failed to initialize Quagga", err)
        return
      }
      Quagga.CameraAccess.getActiveTrack().applyConstraints({ advanced: [{ zoom: 1.5 }] });
      Quagga.onDetected((res: any) => {
        Quagga.stop()
        props.onDetected(res)
      })
      Quagga.start()
    })
  }, [])

  return (
    <div ref={ref}></div>
  )
}
