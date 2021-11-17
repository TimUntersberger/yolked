import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

function get_correct_bar_code(array: any[]) {
  if (array.length == 0)
    return null;
  const modeMap: any = {};
  let maxEl = array[0], maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

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
      multiple: true,
      numOfWorkers: 8,
      decoder: {
        readers: ["ean_reader", "upc_reader"],
        multiple: true
      },
    }, function(err: any) {
      if (err) {
        console.error("Failed to initialize Quagga", err)
        return
      }
      Quagga.CameraAccess.getActiveTrack().applyConstraints({ advanced: [{ zoom: 1.5 }] });
      const results: any[] = []
      Quagga.onDetected((res: any) => {
        res.forEach((res: any) => results.push(res))

        if (results.length > 20) {
          Quagga.stop()
          props.onDetected(get_correct_bar_code(results))
        }
      })
      Quagga.start()
    })
  }, [])

  return (
    <div className="quagga-container h-full overflow-y-hidden" ref={ref}></div>
  )
}
