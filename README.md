# Shake Counter

This project is a simple web application built with React and Vite that uses the device's accelerometer and gyroscope sensors to count "shakes." When the device is shaken, the app increments a counter, with a loading animation displayed while initializing the sensors.

# Installation

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/your-username/shake-counter.git

   cd shake-counter
   ```

2. Install the dependencies:
   ```
   npm install
   ```

# Running the App

## Start the development server using Vite:

```
 npm run dev
```

# Shake Detection Logic

The app uses device motion and orientation APIs to detect shake events based on acceleration data from the device’s accelerometer or gyroscope.

## Key Parts of the Logic

1. Sensor Initialization:

- The app checks if the device supports the accelerometer and gyroscope sensors. If not, an error message is displayed.
- On Android devices or non-Firefox browsers, a permission request is sent using the Permissions API. If the user grants permission, sensor initialization proceeds.

2. Shake Detection:

- Threshold-Based Detection: When the sensor detects acceleration above a predefined threshold (SHAKE_THRESHOLD) in any of the x, y, or z axes, this is considered the start of a potential shake.
- Direction Change or Stop Check: After this initial movement, the logic waits to see if the acceleration either drops below the threshold or if there is an acceleration change in the opposite direction. This indicates a stop or reversal of movement, which is typical of a shake.
- Debounce to Prevent Multiple Counts: To avoid registering multiple shakes for a single movement, the algorithm introduces a minimum time interval between shake detections. This debounce interval helps ensure that only distinct, intentional shakes are counted, filtering out noise from continuous or minor movements.

3. Adjustable Frequency:

- The update frequency of the sensor is controlled by a slider, allowing users to specify how often the sensor data should be read (between 10 and 60 Hz).
