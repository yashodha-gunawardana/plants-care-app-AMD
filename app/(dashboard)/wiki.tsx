import DashboardHeader from "@/components/Header";
import { useSearch } from "@/context/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform, UIManager, Text, StyleSheet, View, ScrollView } from "react-native";



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
    const parts = text.split(regex);

    return (
        <Text style={style}>
            {parts.map((part, index) => (
                <Text
                    key={index}
                    style={part.toLowerCase() === highlight.toLowerCase()
                        ? styles.highlight : undefined
                    }>
                        
                        {part}
                </Text>
            ))}
        </Text>
    );
};


const WikiScreen = () => {

    const { searchQuery } = useSearch();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // store bookmarked wiki item IDs
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    const filteredData = wikiData.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // extract unique category names
    const categories = Array.from(
        new Set(filteredData.map((item) => item.category))
    );


    // load saved bookmarks when screen loads
    useEffect(() => {
        const loadBookmarks = async () => {
            const stored = await AsyncStorage.getItem("WikiBookmarks");
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        };
        loadBookmarks();
    }, []);


    // add 0r remore bookmark and save
    const toggleBookmark = async (id: string) => {
        const updatedBookmarks = bookmarks.includes(id)
            ? bookmarks.filter((b) => b !== id)
            : [...bookmarks, id];

        setBookmarks(updatedBookmarks);
        await AsyncStorage.setItem("WikiBookmarks", JSON.stringify(updatedBookmarks));
    };


    return (
        <View style={styles.mainWrapper}>
            <DashboardHeader />

            <ScrollView style={styles.container} showsHorizontalScrollIndicator={false}>
                
                {/* page title */}
                <View style={styles.headerTextContainer}>
                    <Text style={styles.pageTitle}>Growing & care Guide</Text>
                    <Text style={styles.pageSubtitle}>Master the art of plant care</Text>
                </View>

                {/* category */}
                {categories.map((category) => {
                    const isSearching = searchQuery.length > 0;

                    // section is auto expaned when searching
                    const isExpanded = isSearching || expandedCategory === category;

                    return (
                        <View
                            key={category}
                            style={styles.categoryWrapper}> 

                        </View>
                    )
                })}
            </ScrollView>
        </View>

    );
};


const styles = StyleSheet.create({

    mainWrapper: { flex: 1, backgroundColor: "#fdfdfb7e" },
    container: { flex: 1, paddingHorizontal: 20 },
    headerTextContainer: { marginVertical: 25 },
    pageTitle: { fontSize: 28, fontWeight: "800", color: "#1A3C34" },
    pageSubtitle: { fontSize: 14, color: "#8A9687", marginTop: 4 },

    categoryWrapper: {
        marginBottom: 12,
        backgroundColor: "#FFF",
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F2F2F2",
    },
    
    highlight: {
        backgroundColor: "#D1E9FF",
        color: "#1A3C34",
        fontWeight: "bold",
    },
});


export default WikiScreen;