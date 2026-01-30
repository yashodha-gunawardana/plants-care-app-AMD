import { Platform, UIManager } from "react-native";



// android animation setup
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


type wikiItem = {
    id: string;
    category: string;
    title: string;
    description: string;
    icon: string;
}