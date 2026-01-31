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


export async function cancelPlantNotifications(plantId: string) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {
        
    }
}