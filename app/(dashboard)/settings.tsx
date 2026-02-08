import { AuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, User } from "firebase/auth";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Switch, Alert } from "react-native";


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