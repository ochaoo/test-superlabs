import { useState, useEffect, useCallback } from "react";

const SHAKE_THRESHOLD = 25;
const DEFAULT_FREQUENCY = 20;

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState(null);
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
  const [isLoading, setIsLoading] = useState(true);

  const isFirefox = typeof InstallTrigger !== "undefined";

  const handleShake = (() => {
    let lastX = 0,
      lastY = 0,
      lastZ = 0;
    let lastShakeDetected = false;

    return (sensor) => {
      const { x, y, z } = sensor;

      const deltaX = x - lastX;
      const deltaY = y - lastY;
      const deltaZ = z - lastZ;

      const shakeDetected =
        (Math.abs(deltaX) > SHAKE_THRESHOLD ||
          Math.abs(deltaY) > SHAKE_THRESHOLD ||
          Math.abs(deltaZ) > SHAKE_THRESHOLD) &&
        (Math.sign(deltaX) !== Math.sign(lastX) ||
          Math.sign(deltaY) !== Math.sign(lastY) ||
          Math.sign(deltaZ) !== Math.sign(lastZ) ||
          (Math.abs(x) < SHAKE_THRESHOLD &&
            Math.abs(y) < SHAKE_THRESHOLD &&
            Math.abs(z) < SHAKE_THRESHOLD));

      if (shakeDetected && !lastShakeDetected) {
        setShakeCount((prev) => prev + 1);
        setIsShaking(true);
      }

      lastShakeDetected = shakeDetected;
      lastX = x;
      lastY = y;
      lastZ = z;
    };
  })();

  const initializeSensor = useCallback(() => {
    if (!("Accelerometer" in window) && !("Gyroscope" in window)) {
      setError("Your device does not support accelerometer and gyroscope.");
      setIsLoading(false);
      return null;
    }

    const sensorTypeName =
      "Accelerometer" in window ? "Accelerometer" : "Gyroscope";
    try {
      const SensorClass =
        sensorTypeName === "Accelerometer" ? Accelerometer : Gyroscope;
      const sensor = new SensorClass({ frequency });
      sensor.addEventListener("reading", () => handleShake(sensor));
      sensor.start();
      setIsLoading(false);
      return sensor;
    } catch (err) {
      if (err.name === "SecurityError" || err.name === "NotAllowedError") {
        setError(
          "Access to the device's motion sensors is blocked. Please allow access."
        );
      } else if (err.name === "NotReadableError") {
        setError(
          `Unable to access ${sensorTypeName} sensor data. Try restarting the device or browser.`
        );
      } else {
        setError(`Error accessing ${sensorTypeName}: ${err.message}`);
      }

      setIsLoading(false);
      return null;
    }
  }, [frequency]);

  const checkPermissionsAndInitializeSensor = useCallback(() => {
    if (isFirefox) {
      initializeSensor();
    } else if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "accelerometer" })
        .then((result) => {
          if (result.state === "denied") {
            setError(
              "Usage of accelerometer is not allowed. Please allow access."
            );
            setIsLoading(false);
          } else {
            initializeSensor();
          }
        })
        .catch((err) => {
          setError(`Error checking permission: ${err.message}`);
        });
    } else {
      initializeSensor();
    }
  }, [initializeSensor]);

  useEffect(() => {
    const sensor = checkPermissionsAndInitializeSensor();

    return () => {
      if (sensor) sensor.stop();
    };
  }, [checkPermissionsAndInitializeSensor]);

  useEffect(() => {
    if (isShaking) {
      const timeout = setTimeout(() => setIsShaking(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isShaking]);

  const handleReset = () => setShakeCount(0);

  const handleFrequencyChange = (e) => setFrequency(Number(e.target.value));

  const renderLoader = () => (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p>Initializing sensors...</p>
    </div>
  );

  const renderError = () => <p className="text-red-500">{error}</p>;

  const renderCounter = () => (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`w-40 h-40 ${
          isShaking ? "animate-ping" : ""
        } bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl`}
      >
        {shakeCount}
      </div>
      <button
        onClick={handleReset}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Reset counter
      </button>
      <div className="mt-4 flex items-center">
        <label htmlFor="frequency" className="mr-2">
          Update frequency:
        </label>
        <input
          id="frequency"
          type="range"
          min="10"
          max="60"
          value={frequency}
          onChange={handleFrequencyChange}
        />
        <span className="ml-2">{frequency} Hz</span>
      </div>
    </div>
  );

  return (
    <div className="h-full pt-32 px-4 flex flex-col items-center ">
      <h1 className="text-2xl font-bold mb-4">Shake counter</h1>
      {isLoading ? renderLoader() : error ? renderError() : renderCounter()}
    </div>
  );
}

export default App;
