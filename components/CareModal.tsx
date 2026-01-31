import { Dimensions, Modal, StyleSheet, View } from "react-native";


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
});