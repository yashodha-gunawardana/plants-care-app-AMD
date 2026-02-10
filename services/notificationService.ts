import { Plant } from "@/context/PlantContext";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import Constants from "expo-constants";


if (Constants.appOwnership !== "expo") {
    Notifications.setNotificationHandler({
    handleNotification: async ()=>  ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});
}


// requests permission from the user to send push notifications
export async function requestNotificationPermissions() {

     // sSkip remote push logic in Expo Go
    if (Constants.appOwnership === "expo") {
        console.log("Expo Go detected: using local notifications only");
        return;
    }
    
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
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
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

    for (const care of careTypes) {
        const schedule = plant.careSchedules[care.key as keyof typeof plant.careSchedules];

        if (schedule && schedule.selectedDays && schedule.selectedDays.length > 0) {
            const [hour, minute] = (schedule.selectedTime || "07:00").split(':').map(Number);

            for (const dayIndex of schedule.selectedDays) {
                // Sunday is 1, Monday is 2, etc.
                const weekday = dayIndex === 6 ? 1 : dayIndex + 2;

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `${care.emoji} ${care.label} Time!`,
                        body: `Your ${plant.name} is ready for its ${care.key} routine.`,
                        data: { plantId: plant.id, type: care.key }, 
                    },
                    // FIX: Removed 'type: CALENDAR' for Android compatibility
                    trigger: {
                        type: SchedulableTriggerInputTypes.WEEKLY,
                        hour,
                        minute,
                        weekday,
                    },
                });
            }
        }
    }
}

