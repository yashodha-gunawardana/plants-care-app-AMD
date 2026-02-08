import { AuthContext } from "@/context/AuthContext";
import { requestNotificationPermissions } from "@/services/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, User, updateProfile, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Switch, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";


// clodinary config for optimized image delivery
const CLOUD_NAME = "dnefdegz0";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
const DEFAULT_AVATAR_ID = "default_placeholder_crn3se";

const COLORS = {
    forest: "#17402A",
    white: "#FFFFFF",
    muted: "#83918B",
    brown: "#8D6E63",
    lightRed: "#FFF1F1",
    darkRed: "#D32F2F",
    lightGray: "#F0F0F0",
    golden: "#F4A261",
};


// list avatar 
const AVATAR_PUBLIC_IDS: string[] = [
    "male_2_rnpy7q", "male_1_mcnb1r", "female_3_ztizys",
    "female_2_yuk22n", "female_1_bjjecv", "cute_1_mlthan",
];


// option row
const SettingRow = ({ icon, label, value, onValueChange, iconBg, iconColor, trackColor}: any) => (
    <View style={styles.optionRow}>
        <View style={styles.optionIconLabel}>
            <View style={[styles.iconBox, { backgroundColor: iconBg}]}>
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            
            <Text style={styles.optionText}>{label}</Text>
        </View>

        <Switch 
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#D1D1D1", true: trackColor}}
            thumbColor={COLORS.white}>
        </Switch>
    </View>
);


const SettingsScreen = () => {
    const router = useRouter();
    const auth = getAuth();

    // global authentication state
    const { user, loading, logout } = useContext(AuthContext) as {
        user: User | null;
        loading: boolean;
        logout: () => void;
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
    const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [showAvatargrid, setShowAvatarGrid] = useState<boolean>(false);


    // generate a cloudinary url
    const getAvatarUrl = (publicId: string) =>
        `${CLOUDINARY_BASE_URL}/w_200,c_fill,g_face,f_auto,q_auto/${publicId}.png`;


    // profile photo manage
    const handleProfilePress = () => {
        Alert.alert(
            "Profile Photo",
            "Manage your profile appearance", [

                { text: "Choose from Avatars", onPress: () => setShowAvatarGrid(true) },
                { text: "Remove Profile Photo", style: "destructive", onPress: handleRemoveAvatar },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };


    // remove profile avatar
    const handleRemoveAvatar = async () => {
        try {
            if (!auth.currentUser) 
                throw new Error("No user is logged in.");
            
            await updateProfile(auth.currentUser, { photoURL: ""});
            setSelectedAvatar(null);
            setShowAvatarGrid(false);

            Alert.alert(
                "Removed",
                "Reverted to default profile image."
            );

        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };


    // update profile new avatar
    const handleAvatarSelect = async (publicId: string) => {
        const avatarUrl = getAvatarUrl(publicId);

        try {
            if (!auth.currentUser) throw new Error("No user is logged in.");

            setSelectedAvatar(publicId); 
            setShowAvatarGrid(false);
        
            await updateProfile(auth.currentUser, { photoURL: avatarUrl });
            Alert.alert("Success", "Avatar updated!");

        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };


    // notifications toggle
    const handleNotificationsToggle = async (value: boolean) => {
        setNotificationsEnabled(value);

        if (value) {

            // test notification immediately 
            await requestNotificationPermissions();
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Notification active",
                    body: "You will receive care alerts for your plants"
                },
                trigger: null;
            });
        }

        if (user) await setDoc(doc(db, "users", user.uid), { notificationsEnabled: value }, { merge: true });
    };


    // reminders toggle
    const handleRemindersToggle = async (value: boolean) => {
        setRemindersEnabled(value);
        
        if (value) {
            await requestNotificationPermissions();
            
            try {

                // schedule a recurring daily notification
                await Notifications.scheduleNotificationAsync({
                    identifier: "daily-garden-checkin", 
                    content: {
                        title: "Good Morning! 🌿",
                        body: "Time to check if your plants need some love today.",
                        sound: 'default',
                    },
                    trigger: {
                        type: SchedulableTriggerInputTypes.DAILY,
                        hour: 7,
                        minute: 0,
                    },
                });

                Alert.alert(
                    "Daily Reminder Set", 
                    "I'll remind you to check your plants every morning at 7:00 AM."
                );

            } catch (error) {
                console.error("Notification Error:", error);
            }
            
        } else {

            // if toggled off, remove only the specific recurring alarm by its ID.
            await Notifications.cancelScheduledNotificationAsync("daily-garden-checkin");

            Alert.alert(
                "Reminders Off", 
                "Daily check-in notifications disabled."
            );
        }

        if (user) await setDoc(doc(db, "users", user.uid), { remindersEnabled: value }, { merge: true });
    };



    // delete account and clear data
    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "This will permanently delete your profile, all your plants, and stop all reminders. This cannot be undone.", [

                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete Everything",
                    style: "destructive",
                    onPress: async () => {

                        try {
                            if (!auth.currentUser) return;

                            const userId = auth.currentUser.uid;

                            // wipe all local alarms from the device
                            await Notifications.cancelAllScheduledNotificationsAsync();

                            // delete the user settings document from Firestore
                            await deleteDoc(doc(db, "users", userId));

                            // remove the user record from Firebase Authentication
                            await deleteUser(auth.currentUser);

                            Alert.alert(
                                "Account Deleted",
                                "Your data has been wiped successfully."
                            );
                            router.replace("/(auth)/loginRegister");

                        } catch (err: any) {
                            if (err.code === "auth/requires-recent-login") {
                                Alert.alert(
                                    "Sensitive Operation",
                                    "For your security, please log out and log back in before deleteing your account"
                                );

                            } else {
                                Alert.alert("Error", err.message);
                            }
                        }
                    }
                }
            ]
        );
    };


    // pulls user preferences from Firestore when the screen loads
    useEffect(() => {
        const fetchPreferences = async () => {
            if (!user) return;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setNotificationsEnabled(data.notificationsEnabled ?? true);
                setRemindersEnabled(data.remindersEnabled ?? false);
            }
        };
        fetchPreferences();
    }, [user]);
    
}


const styles = StyleSheet.create({

    optionRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        backgroundColor: COLORS.white, 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        borderRadius: 20, 
        marginBottom: 12, 
        shadowColor: "#000", 
        shadowOpacity: 0.05, 
        elevation: 2 
    },

    optionIconLabel: { flexDirection: "row", alignItems: "center" },

    iconBox: { 
        width: 40, 
        height: 40, 
        borderRadius: 12, 
        justifyContent: "center", 
        alignItems: "center", 
        marginRight: 14 
    },

    optionText: { fontSize: 16, fontWeight: "600", color: COLORS.forest },

});



export default SettingsScreen;