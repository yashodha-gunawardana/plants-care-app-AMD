import { AuthContext } from "@/context/AuthContext";
import { requestNotificationPermissions } from "@/services/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, User, updateProfile, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Switch, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Image } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import DashboardHeader from "@/components/Header";


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


    // logout 
    const confirmLogout = () => {
        Alert.alert(
            "Logout", 
            "Sign out of your account?", [

                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: async () => {
                    await logout();
                    router.replace("/(auth)/loginRegister");
                }},
            ]
        );
    };


    if (loading) return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.forest} />
        </View>
    );


    return (
        <View style={{ flex: 1}}>
            <LinearGradient colors={["#D6DED9", "#FFFFFF"]} style={styles.mainContainer}>
                <DashboardHeader />

                {/* bg leaf */}
                <View style={styles.leafOverlay} pointerEvents="none">
                    <Ionicons name="leaf" size={320} color="#3E4D48" style={{ opacity: 0.04 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}>

                    {/* profile header */}
                    {user && (
                        <View style={styles.minimalProfileSection}>
                            <TouchableOpacity 
                                style={styles.profileFrame} 
                                onPress={handleProfilePress} 
                                activeOpacity={0.8}>

                                <Image
                                    source={{
                                        uri: selectedAvatar
                                            ? getAvatarUrl(selectedAvatar)
                                            : user?.photoURL || getAvatarUrl(DEFAULT_AVATAR_ID)
                                    }}
                                    style={styles.fullRoundedAvatar}
                                />

                                <View style={styles.cameraIconWrapper}>
                                    <Ionicons name="camera" size={20} color={COLORS.white} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.profileTextWrapper}>
                                <Text style={styles.profileName}>{user.displayName || "User Name"}</Text>
                                <Text style={styles.profileEmail}>{user.email}</Text>
                            </View>
                        </View>
                    )}


                    {/* show avatar selection */}
                    {showAvatargrid && (
                        <View style={styles.gridContainer}>
                            <View style={styles.gridHeader}>
                                <Text style={styles.sectionTitle}>Choose Your Avatar</Text>
                                <TouchableOpacity onPress={() => setShowAvatarGrid(false)}>
                                    <Ionicons name="close" size={20} color={COLORS.muted} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.avatarGrid}>
                                {AVATAR_PUBLIC_IDS.map((id) => (

                                    <TouchableOpacity
                                        key={id}
                                        onPress={() => handleAvatarSelect(id)}
                                        style={[styles.avatarItem, selectedAvatar === id && styles.selectedAvatarItem]}>
                                    
                                        <Image source={{ uri: getAvatarUrl(id) }} style={styles.miniAvatar} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}


                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Preferences</Text>
          
                    <SettingRow 
                        icon="notifications-outline" label="Notifications"
                        value={notificationsEnabled} onValueChange={handleNotificationsToggle}
                        iconBg="#E8F5E1" iconColor={COLORS.forest} trackColor={COLORS.forest}
                    />

                    <SettingRow 
                        icon="alarm-outline" label="Reminders"
                        value={remindersEnabled} onValueChange={handleRemindersToggle}
                        iconBg="#FFF4E5" iconColor={COLORS.golden} trackColor={COLORS.golden}
                    />

                    <View style={styles.divider} />
                    

                    {/* account actions */}
                    <TouchableOpacity style={styles.actionBtn} onPress={confirmLogout}>
                        <Ionicons name="log-out-outline" size={22} color={COLORS.forest} />
                        <Text style={styles.actionText}>Log Out Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionBtn, { marginTop: 12, backgroundColor: COLORS.lightRed }]} 
                        onPress={handleDeleteAccount}>
                    
                        <Ionicons name="trash-outline" size={22} color={COLORS.darkRed} />
                        <Text style={[styles.actionText, { color: COLORS.darkRed }]}>Delete Account</Text>
                    </TouchableOpacity>
                    
                    <View style={{ height: 50 }} />

                </ScrollView>
            </LinearGradient>

        </View>
    )
    
}


const styles = StyleSheet.create({

    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    mainContainer: { flex: 1 },

    leafOverlay: { 
        position: "absolute", 
        bottom: -60, 
        right: -80, 
        transform: [{ rotate: "-15deg" }], 
        zIndex: 10 
    },

    content: { padding: 24 },

    minimalProfileSection: { flexDirection: "row", alignItems: "center", marginVertical: 15 },

    profileFrame: { 
        width: 106, 
        height: 106, 
        borderRadius: 53, 
        borderWidth: 3, 
        borderColor: COLORS.brown, 
        justifyContent: "center", 
        alignItems: "center" 
    },

    fullRoundedAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.lightGray },

    cameraIconWrapper: { 
        position: "absolute", 
        bottom: 0, 
        right: 0, 
        backgroundColor: COLORS.forest, 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        justifyContent: "center", 
        alignItems: "center", 
        borderWidth: 2, 
        borderColor: COLORS.white 
    },

    profileTextWrapper: { marginLeft: 20, flexShrink: 1 },
    profileName: { fontSize: 20, fontWeight: "800", color: COLORS.forest },
    profileEmail: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
    gridContainer: { marginVertical: 20 },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: "700", color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },

    avatarGrid: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        backgroundColor: COLORS.white, 
        padding: 15, 
        borderRadius: 20, 
        gap: 12, 
        elevation: 2 
    },

    avatarItem: { padding: 2 },
    selectedAvatarItem: { borderWidth: 2, borderColor: COLORS.forest, borderRadius: 35 },
    miniAvatar: { width: 60, height: 60, borderRadius: 30 },
    divider: { height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginVertical: 25 },

    actionBtn: { 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#E9EDEB", 
        padding: 18, 
        borderRadius: 22 
    },

    actionText: { color: COLORS.forest, fontSize: 16, fontWeight: "800", marginLeft: 10 },
    
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