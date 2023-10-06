export function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    });
  } else {
    console.log("This browser does not support notifications.");
  }
}

export function displayNotification(title, options) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(title, options);
    // You can optionally handle notification events (click, close, etc.) here
    notification.onclick = () => {
      console.log("Notification clicked!");
      // Add actions to be performed when notification is clicked
    };
  } else {
    console.log("Notification permission not granted.");
  }
}
