import Pusher from "pusher-js";

const usePusher = new Pusher(`${import.meta.env.VITE_PUSHER_APP_ID}`, {
  cluster: `${import.meta.env.VITE_CLUSTER}`,
  encrypted: true, // Enable encryption if your Pusher app uses HTTPS
});

export { usePusher };
