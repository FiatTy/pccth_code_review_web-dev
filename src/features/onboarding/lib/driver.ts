import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import '@/styles/driver-theme.css'; // We will create this for Tailwind compatibility

export function createTour(steps: DriveStep[], onComplete: () => void) {
  const driverObj = driver({
    showProgress: true,
    steps,
    onDestroyStarted: () => {
      if (driverObj.hasNextStep()) {
        driverObj.destroy();
      }
      onComplete();
    },
    popoverClass: 'driverjs-theme',
  });
  return driverObj;
}

