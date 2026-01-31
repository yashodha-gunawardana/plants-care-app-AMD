import { Plant } from "@/context/PlantContext";
import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
    handleNotification: async ()=>  ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});


// requests permission from the user to send push notifications
export async function requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
    }
};


// removes all scheduled reminders for a specific plant (for plant deleted or schedules updated)
export async function cancelPlantNotifications(plantId: string) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {

        // look inside the 'data' object we stored to find the specific plant ID
        if (notification.content.data?.plantId === plantId) {
            await Notifications.cancelAllScheduledNotificationsAsync(notification.identifier);
        }
    }
};


// loops through a plant's care requirements and schedules recurring weekly alerts
export async function scheduleAllPlantReminders(plant: Plant) {
    if (!plant.careSchedules) return;

    const careTypes = [
        { key: "watering", emoji: "💧", label: "Water" },
        { key: "fertilize", emoji: "🧪", label: "Fertilize" },
        { key: "repot", emoji: "🪴", label: "Repot" },
    ] as const;
}

