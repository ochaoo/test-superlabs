# Shake Counter

This project is a simple web application built with React and Vite that uses the device's accelerometer and gyroscope sensors to count "shakes." When the device is shaken, the app increments a counter, with a loading animation displayed while initializing the sensors.

# Installation

1. Clone this repository to your local machine:
      ```
      git clone https://github.com/your-username/shake-counter.git
   
      cd shake-counter
      ```
3. Install the dependencies:
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

- The SHAKE_THRESHOLD constant sets a minimum acceleration value that indicates a shake.
- Every time new data is received from the accelerometer or gyroscope, the app checks if the absolute value of acceleration on the x, y, or z axes exceeds SHAKE_THRESHOLD.
- If so, it increments the shake count and briefly animates the counter as visual feedback for the shake.

3. Adjustable Frequency:

- The update frequency of the sensor is controlled by a slider, allowing users to specify how often the sensor data should be read (between 10 and 60 Hz).
