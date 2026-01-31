import { Dimensions } from "react-native";


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
}