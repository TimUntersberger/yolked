import React, { useState } from "react";
import BarCodeScanner from "../components/BarCodeScanner";

export default function() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<any | undefined>();

  if (scanning) {
    return <BarCodeScanner onDetected={res => {
      setScannedCode(res)
      setScanning(false)
    }} />
  }

  if (scannedCode) {
    return (<div>
      {scannedCode.codeResult.code}
    </div>)
  }

  return (
    <div>
      <button className="border px-2" onClick={() => setScanning(true)}>Scan</button>
    </div>
  )
}
