import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import '@/styles/driver-theme.css'; // We will create this for Tailwind compatibility

export function createTour(steps: DriveStep[], onComplete: (element?: Element, step?: DriveStep, options?: { state: any }) => void) {
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    smoothScroll: true,
    overlayClickBehavior: () => {},
    steps,
    onDestroyed: (element, step, options) => {
      onComplete(element, step, options);
    },
    popoverClass: 'driverjs-theme',
  });
  return driverObj;
}

