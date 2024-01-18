import * as PusherPushNotifications from "@pusher/push-notifications-web";

export const beamsClient = new PusherPushNotifications.Client({
  instanceId: `${import.meta.env.VITE_INSTANCEID}`,
});
