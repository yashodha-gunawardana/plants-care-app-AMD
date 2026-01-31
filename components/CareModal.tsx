import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";


const { width } = Dimensions.get("window");


// define the properties the modal needs to function
interface CareSetupModalProps {
    visible: boolean;
    onClose: () => void;  // function to hide modal
    activeCare: string | null;
    config: any;
    tempConfig: {
        interval: number;
        selectedDays: number[];
        selectedOption: string
    };

    // function to update modal
    setTempConfig: React.Dispatch<React.SetStateAction<any>>;
    onApply: () => void;
    onTrackPress: (event: any) => void;
};

const CareSetupModal = ({
    visible,
    onClose,
    activeCare,
    config,
    tempConfig,
    setTempConfig,
    onApply,
    onTrackPress,
}: CareSetupModalProps) => {

    // if no care type or config is selected, don't render anything
    if (!activeCare || !config) return null;

    const days = ["M", "T", "W", "T", "F", "S", "S"];


    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    {/* header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: config.color }]}>
                            {config.title} Setup
                        </Text>

                        {/* close button to discard changes */}
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={20} color="#1A3C34" />
                        </TouchableOpacity>
                    </View>

                    {/* selction options */}
                    <Text style={styles.modalLabel}>Quick Options</Text>
                    <View style={styles.optionsContainer}>
                        {config.options.map((opt: any) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[
                                    styles.optionButton,

                                    // highlight button if it matches the current selected interval
                                    tempConfig.selectedOption === opt.value && {
                                        borderColor: config.color,
                                        backgroundColor: config.color + "10"
                                    }]}
                                    onPress={() => 
                                        setTempConfig((prev: any) => ({
                                            ...prev,
                                            selectedOption: opt.value,
                                            interval: parseInt(opt.value)
                                        }))
                                    }>
                                    
                                    <Text
                                        style={[
                                            styles.optionButtonText,
                                            tempConfig.selectedOption === opt.value && {
                                                color: config.color,
                                        }]}>
                                        {opt.label}
                                    </Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* slider section */}
                    <Text style={styles.modalLabel}>
                        Frequency: {tempConfig.interval > 0 ? tempConfig.interval : "__"}{" "}
                        {config.unit}
                    </Text>

                    {/* 'onTrackPress' calculates the value based on where the user taps */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onTrackPress}
                        style={styles.sliderBox}>
                    
                        <View style={styles.track}>
                            <View
                                style={[
                                    styles.thumb,
                                    {
                                        backgroundColor: config.color,
                                        left: `${(tempConfig.interval / 30) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalOverlay: { 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.45)", 
        justifyContent: "flex-end" 
    },
    modalContent: { 
        backgroundColor: "#FFF", 
        borderTopLeftRadius: 35, 
        borderTopRightRadius: 35, 
        padding: 30, 
        minHeight: "65%" 
    },
    modalHeader: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 25 
    },

    modalTitle: { fontSize: 24, fontWeight: "800" },
    closeBtn: { backgroundColor: "#F5F5F5", padding: 10, borderRadius: 12 },

    modalLabel: { 
        fontSize: 16, 
        fontWeight: "700", 
        color: "#333", 
        marginBottom: 15, 
        marginTop: 10 
    },
    optionsContainer: { 
        flexDirection: "row", 
        gap: 10, 
        marginBottom: 20 
    },
    optionButton: { 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        borderRadius: 25, 
        borderWidth: 1.5, 
        borderColor: "#EEE" 
    },
    optionButtonText: { 
        fontSize: 13, 
        fontWeight: "700", 
        color: "#777" 
    },

    sliderBox: { paddingVertical: 25, marginBottom: 15 },

    track: { 
        height: 5, 
        backgroundColor: "#F0F0F0", 
        borderRadius: 3, 
        position: "relative" 
    },
    thumb: { 
        width: 22, 
        height: 22, 
        borderRadius: 11, 
        position: "absolute", 
        top: -8.5, 
        transform: [{ translateX: -11 }] 
    },
});