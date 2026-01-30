import { Platform, UIManager, Text } from "react-native";



// android animation setup
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


type WikiItem = {
    id: string;
    category: string;
    title: string;
    description: string;
    icon: string;
}


const wikiData: WikiItem[] = [
    { 
        id: "1", 
        category: "Watering 💧", 
        title: "How often to water?", 
        description:
        "Most indoor plants need water every 3-7 days. 🚿 Check soil 1-2 inches deep; if dry, water. Overwatering is the #1 cause of plant death. 🥀\n\nExamples:\n- 🐍 Snake Plant: every 2-3 weeks\n- 🏳️ Peace Lily: 1-2 times/week\n- 🌵 Succulents: once every 2-3 weeks", 
        icon: "water" 
    },
    { 
        id: "2", 
        category: "Watering 💧", 
        title: "Watering techniques", 
        description: "Water evenly around the base, avoid wetting leaves. 💦 Use room-temp water. 🌡️\n\nPlant-specific:\n- 🌳 Fiddle Leaf Fig: water until it drains\n- 🕷️ Spider Plant: keep soil slightly moist\n- 🌵 Cactus: soak deeply but infrequently", 
        icon: "water" 
    },
    { 
        id: "3", 
        category: "Sunlight ☀️", 
        title: "Sunlight placement", 
        description: "Most indoor plants prefer bright, indirect sunlight. 🌤️ Avoid direct sunlight for sensitive plants. Rotate weekly. 🔄\n\nExamples:\n- 🌿 Monstera: indirect light\n- 🌱 ZZ Plant: low-light tolerant\n- 🌵 Succulents: 4-6 hrs direct sunlight", 
        icon: "sunny" 
    },
    { 
        id: "4", 
        category: "Sunlight ☀️", 
        title: "Light requirements", 
        description: "🌑 Low-light: Snake Plant, ZZ Plant\n⛅ Medium-light: Peace Lily, Spider Plant\n☀️ High-light: Fiddle Leaf Fig, Succulents", 
        icon: "sunny" 
    },
    { 
        id: "5", 
        category: "Soil 🪴", 
        title: "Best soil types", 
        description: "Use well-draining soil. 🕳️ Mix perlite/vermiculite for aeration. 💨\n\nPlant examples:\n- 🌵 Succulents: cactus soil\n- 🌿 Ferns: rich, moist soil\n- 🌸 Orchids: bark-based mix", 
        icon: "leaf" 
    },
    { 
        id: "6", 
        category: "Soil 🪴", 
        title: "Soil maintenance", 
        description: "Repot every 1-2 years. 🏡 Trim rotten roots. ✂️\n\nExamples:\n- 🏳️ Peace Lily: repot if roots outgrow pot\n- 🪵 Aloe Vera: every 2-3 years\n- 🌳 Rubber Plant: yearly", 
        icon: "leaf" 
    },
    { 
        id: "7", 
        category: "Fertilizing 🧪", 
        title: "Fertilizing schedule", 
        description: "Feed monthly during growing season (spring/summer) 🍏 with balanced liquid fertilizer. Reduce in fall/winter. ❄️\n\nPlant tips:\n- 🌳 Fiddle Leaf Fig: monthly spring/summer\n- 🌸 Orchids: dilute fertilizer every 2 weeks\n- 🌵 Succulents: light fertilization", 
        icon: "nutrition" 
    },
    { 
        id: "8", 
        category: "Fertilizing 🧪", 
        title: "How to fertilize properly", 
        description: "Water before fertilizing to prevent root burn. 🧴 Avoid over-fertilizing. ⚠️\n\nOrganic options:\n- 🍵 Compost tea, diluted fish emulsion, worm castings 🪱", 
        icon: "nutrition" 
    },
    { 
        id: "9", 
        category: "Pruning ✂️", 
        title: "Pruning and maintenance", 
        description: "Remove dead/yellow leaves. 🍂 Trim leggy growth. Use clean scissors. ✂️\n\nPlant examples:\n- 🌿 Monstera: control size/shape\n- 🕷️ Spider Plant: cut brown tips\n- 🌳 Fiddle Leaf Fig: prune for upward growth", 
        icon: "cut" 
    },
    { 
        id: "10", 
        category: "Pruning ✂️", 
        title: "Pest prevention", 
        description: "Inspect weekly for insects. 🔍 Wipe leaves, remove infested parts. Use neem oil or insecticidal soap. 🧼\n\nPlants prone to pests:\n- 🌳 Fiddle Leaf Fig: spider mites 🕷️\n- 🌹 Indoor Roses: aphids 🐞\n- 🌸 Orchids: scale insects", 
        icon: "cut" 
    },
];

// component for highlight search words
const HighlightedText = ({
    text,
    highlight,
    style,
}: {
    text: string;
    highlight: string;
    style: any;
}) => {
    // if search text empty, show normal
    if (!highlight.trim()) {
        return <Text style={style}>{text}</Text>
    }

    // split text using search keyword
    const regex = new RegExp(`(${highlight})`, "gi");
    
}