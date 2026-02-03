import DashboardHeader from "@/components/Header";
import PlantCard from "@/components/PlantCard";
import { PlantContext } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { 
    Dimensions, Animated, PanResponder, Alert, View, 
    StyleSheet, RefreshControl, Text, TouchableOpacity, 
    ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";


// get screen dimensions for initial placement of the draggable button
const { width, height } = Dimensions.get("window");

const HAS_SEEN_WELCOME_KEY = "has_seen_welcome";

// White, Green, and Yellow Color Palette
const COLORS = {

    white: '#FFFFFF',
    
    forest: '#17402A',
    lightGreen: '#E8F5E1',
    golden: '#F4A261',
    lightYellow: '#FFF4E1',
    charcoal: '#333333',
    lightGray: '#F0F0F0',
    
    sunshine: '#FFD700',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
};

const HomeScreen = () => {
    const { plants, loading, fetchPlants } = useContext(PlantContext);
    const router = useRouter();
    
    // State to track if this is first login
    const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);
    
    // for the entry fade-in effect
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    // 'pan' tracks the X and Y animated coordinates
    const pan = useRef(new Animated.ValueXY({ x: width - 85, y: height - 200 })).current;
    
    // 'lastOffset' stores the static position where the user stopped dragging
    const lastOffset = useRef({ x: width - 85, y: height - 200 });

    // Check if user has seen welcome screen
    useEffect(() => {
        const checkFirstLogin = async () => {
            try {
                const hasSeenWelcome = await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
                setIsFirstLogin(!hasSeenWelcome);
                
                if (!hasSeenWelcome) {
                    // Mark that user has seen welcome screen
                    await AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, "true");
                }
            } catch (error) {
                console.error("Error checking first login:", error);
                setIsFirstLogin(false);
            }
        };
        
        checkFirstLogin();
    }, []);

    useEffect(() => {
        // keep lastOffset synchronized with the animated value to prevent jumping
        const listenerId = pan.addListener((value) => {
            lastOffset.current = value;
        });
        return () => {
            pan.removeListener(listenerId);
        };
    }, []);

    // PanResponder handles the touch gestures
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                // when touched set the start point to the last known location
                pan.setOffset({
                    x: lastOffset.current.x,
                    y: lastOffset.current.y
                });
                pan.setValue({ x: 0, y: 0 });  // reset movement delta for the new gesture
            },

            // update pan values as the finger moves
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),

            // when released merge the offset so the button stays at the new spot
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    const [sortType, setSortType] = useState<'newest' | 'alphabetical'>('newest');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, []);

    // calculate Garden Health Stats (Next watering time and Light percentage)
    const bentoStats = useMemo(() => {
        if (plants.length === 0) return { water: "N/A", light: "0%", isUrgent: false };
        const now = new Date();
    
        const nextWateringTimes = plants.map(p => {
            const sched = p.careSchedules?.watering;
            if (!sched || !sched.selectedTime) return null;
        
            const [hours, minutes] = sched.selectedTime.split(':').map(Number);
            const target = new Date();
            target.setHours(hours, minutes, 0, 0);
        
            // if time passed today, look at the next scheduled interval day
            if (target < now) target.setDate(target.getDate() + (sched.interval || 1));
            return target.getTime();

        }).filter((t): t is number => t !== null);

        const soonest = nextWateringTimes.length > 0 ? Math.min(...nextWateringTimes) : null;
        const diffInHours = soonest ? Math.round((soonest - now.getTime()) / (1000 * 60 * 60)) : null;
    
        // calculate what % of plants have a light schedule set
        const lightAvg = Math.round((plants.filter(p => p.careSchedules?.light).length / plants.length) * 100);

        return {
            water: diffInHours === null ? "None" : diffInHours <= 0 ? "Due" : `${diffInHours}h`,
            light: `${lightAvg}%`,
            isUrgent: diffInHours !== null && diffInHours <= 0 // highlight if watering is overdue
        };
    }, [plants]);

    // sort the plant list based on user preference
    const sortedPlants = useMemo(() => {
        const list = [...plants];
        if (sortType === "alphabetical") return list.sort((a, b) => a.name.localeCompare(b.name));
        return list.reverse(); 
    }, [plants, sortType]);

    const handleSortPress = () => {
        Alert.alert("Sort Collection", "Choose viewing preference", [
            { text: "Newest First", onPress: () => setSortType("newest") },
            { text: "Alphabetical (A-Z)", onPress: () => setSortType("alphabetical") },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    // Show loading while checking first login status
    if (isFirstLogin === null) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: COLORS.forest }]}>
                <View style={[styles.loadingCircle, { backgroundColor: COLORS.white }]}>
                    <MaterialCommunityIcons name="sprout" size={60} color={COLORS.forest} />
                </View>
                <Text style={styles.loadingText}>Cultivating your garden...</Text>
            </View>
        );
    }

    
    // If first login OR no plants, show welcome screen
    const shouldShowWelcome = isFirstLogin || plants.length === 0;

    const FeatureCard = ({ icon, title, desc, color }: any) => (
        <View style={[styles.featureCard, { borderColor: color + '40' }]}>
            <MaterialCommunityIcons name={icon} size={32} color={color} />
            <Text style={styles.featureCardTitle}>{title}</Text>
            <Text style={styles.featureCardText}>{desc}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#D6DED9", "#FFFFFF"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.container}>

            <DashboardHeader />

                <SafeAreaView style={{ flex: 1 }}>
                    <Animated.ScrollView
                        contentContainerStyle={[
                            styles.scrollContent,
                            shouldShowWelcome && styles.welcomeScrollContent
                        ]}
                        style={{ opacity: fadeAnim }}
                        refreshControl={
                            <RefreshControl 
                                refreshing={loading}
                                onRefresh={fetchPlants}
                                tintColor={COLORS.forest}
                                colors={[COLORS.forest]}
                            />
                        }
                        showsVerticalScrollIndicator={false}>
                    
                        {shouldShowWelcome ? (
                            // welcome screen for first time users
                            <View style={styles.welcomeContainer}>

                                {/* hero welcome screen */}
                                <View style={styles.heroCard}>
                                    <View style={styles.accentCircle} />

                                    <View style={styles.heroContent}>
                                        <View style={styles.textSection}>
                                            <Text style={styles.tagline}>HELLO, PLANT PARENT! 👋</Text>
                                            <Text style={styles.mainTitle}>Let's Build Your{'\n'}Dream Garden</Text>
                                            <Text style={styles.description}>
                                                Everything you need to keep your green friends happy and healthy.
                                            </Text>
                                        </View>

                                        <TouchableOpacity 
                                            style={styles.whiteButton} 
                                            activeOpacity={0.8}
                                            onPress={() => router.push("/add")}>
                                        
                                            <Text style={styles.buttonText}>Start Your Collection</Text>
                                            <MaterialCommunityIcons name="leaf" size={20} color={COLORS.forest} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* intractive grid steps */}
                                <View style={styles.cardsGrid}>
                                    <Text style={styles.sectionTitle}>How it works</Text>
                                    
                                    <View style={styles.cardsRow}>

                                        <View style={[styles.card, { borderColor: COLORS.lightGreen }]}>

                                            <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightGreen }]}>
                                                <MaterialCommunityIcons name="camera-plus" size={28} color={COLORS.forest} />
                                            </View>

                                            <Text style={styles.cardTitle}>Identify</Text>
                                            <Text style={styles.cardDescription}>Snap a photo to identify instantly.</Text>
                                        </View>

                                        <View style={[styles.card, { borderColor: COLORS.lightYellow }]}>

                                            <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightYellow }]}>
                                                <MaterialCommunityIcons name="water-check" size={28} color={COLORS.golden} />
                                            </View>

                                            <Text style={styles.cardTitle}>Care Guide</Text>
                                            <Text style={styles.cardDescription}>Get custom watering schedules.</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* features showcase */}
                                <View style={styles.featuresSection}>
                                    <Text style={styles.sectionTitle}>Everything you need</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                                        <FeatureCard icon="bell-ring" title="Smart Alerts" desc="Never miss a watering" color={COLORS.forest} />
                                        <FeatureCard icon="hospital-marker" title="Plant Doctor" desc="Diagnose issues" color={COLORS.golden} />
                                        <FeatureCard icon="book-open-variant" title="Plant Wiki" desc="10k+ Species" color={COLORS.forest} />
                                    </ScrollView>
                                </View>

                                {/* community proof */}
                                <View style={styles.statsSection}>
                                    <Text style={styles.statsTitle}>Join 5,000+ Plant Lovers</Text>
                                    <Text style={styles.statLabel}>"The best app for my balcony garden!" - Yashoda G.</Text>
                                </View>

                                <View style={{ height: 100 }} />
                            </View>
                        ) : (
                            // REGULAR HOME SCREEN FOR USERS WITH PLANTS
                            <>
                                {/* garden state */}
                                <View style={styles.bentoGrid}>
                                    <View style={[styles.bentoMain, { backgroundColor: COLORS.forest }]}>
                                        <Text style={styles.bentoMainTitle}>Your Garden</Text>
                                        <Text style={styles.bentoMainSub}>{plants.length} Plants Total</Text>
                                        <MaterialCommunityIcons name="flower-tulip" size={40} color={COLORS.sunshine} style={styles.bentoIcon} />
                                    </View>

                                    {/* watering and light status */}
                                    <View style={styles.bentoCol}>
                                        {/* watering card Changes color if urgent */}
                                        <View 
                                            style={[
                                                styles.bentoSmall, { 
                                                    backgroundColor: bentoStats.isUrgent ? "#FEF2F2" : COLORS.lightGreen,
                                                    borderColor: bentoStats.isUrgent ? COLORS.error : COLORS.lightGreen
                                            }]}>
                                            <Ionicons 
                                                name={bentoStats.isUrgent ? "warning" : "water"} 
                                                size={20} 
                                                color={bentoStats.isUrgent ? COLORS.error : COLORS.forest} 
                                            />
                                            <Text 
                                                style={[styles.bentoSmallText, bentoStats.isUrgent && { 
                                                    color: COLORS.error 
                                                }, { color: COLORS.charcoal }]}>
                                                Next: {bentoStats.water}
                                            </Text>
                                        </View>

                                        {/* light coverage card */}
                                        <View style={[styles.bentoSmall, { backgroundColor: COLORS.lightYellow, borderColor: COLORS.lightYellow }]}>
                                            <Ionicons name="sunny" size={20} color={COLORS.golden} />
                                            <Text style={[styles.bentoSmallText, { color: COLORS.charcoal }]}>{bentoStats.light} Care</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* list section header */}
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: COLORS.charcoal }]}>Collection</Text>
                                    
                                    {/* sort button */}
                                    <TouchableOpacity style={[styles.filterChip, { 
                                        backgroundColor: COLORS.white,
                                        borderColor: COLORS.lightGray 
                                    }]} onPress={handleSortPress}>
                                        <Ionicons name={sortType === 'alphabetical' ? "text-outline" : "options-outline"} size={16} color={COLORS.forest} />
                                        <Text style={[styles.filterText, { color: COLORS.forest }]}>{sortType === 'alphabetical' ? 'A-Z' : 'Sort'}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* render plant cards */}
                                <View style={styles.collectionWrapper}>
                                    {sortedPlants.map((plant, index) => (
                                        <View key={plant.id || index.toString()} style={styles.cardMargin}>
                                            <PlantCard item={plant} />
                                        </View>
                                    ))}
                                </View>

                                {/* extra padding at bottom for the FAB */}
                                <View style={{ height: 100 }} />
                            </>
                        )}
                    </Animated.ScrollView>
                </SafeAreaView>

                {/* Only show draggable FAB if user has plants */}
                {!shouldShowWelcome && (
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.draggableFab,
                            {
                                transform: pan.getTranslateTransform()
                            }
                        ]}>
                    
                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            onPress={() => router.push("/add" as any)}
                            style={[styles.fabInner, { 
                                backgroundColor: COLORS.forest,
                                shadowColor: COLORS.forest 
                            }]}>
                        
                            <Ionicons name="add" size={30} color="#C6F062" />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </LinearGradient>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F7" },
    
    // Loading State
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    loadingCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    loadingText: { fontSize: 18, color: "#FFFFFF", fontWeight: '600', opacity: 0.9 },

    // Scroll Content
    scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
    welcomeScrollContent: { paddingBottom: 40 },

    // Welcome Screen Styles
    welcomeContainer: { padding: 20 },

    heroCard: {
        backgroundColor: COLORS.forest,
        borderRadius: 28,
        padding: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: COLORS.forest,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        marginBottom: 30,
    },
    accentCircle: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    heroContent: { zIndex: 1 },
    textSection: { marginBottom: 20 },
    tagline: {
        color: '#A7D7C5',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    mainTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', lineHeight: 32 },
    description: { color: '#CFE1D9', fontSize: 14, marginTop: 8, lineHeight: 20 },
    whiteButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonText: { color: COLORS.forest, fontWeight: 'bold', marginRight: 10 },
    cardsGrid: { marginBottom: 25 },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 15 },

    cardsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        elevation: 2,
    },
    cardIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.forest },
    cardDescription: { fontSize: 11, color: '#666', marginTop: 4, lineHeight: 16 },

    featuresSection: { marginBottom: 30 },
    featureCard: {
        backgroundColor: '#FFFFFF',
        width: 140,
        padding: 16,
        marginRight: 12,
        borderRadius: 22,
        borderWidth: 1,
        alignItems: 'center',
    },
    featureCardTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.forest, marginTop: 10 },
    featureCardText: { fontSize: 10, color: '#777', textAlign: 'center', marginTop: 4 },

    statsSection: { backgroundColor: '#EEF5F1', padding: 20, borderRadius: 22, alignItems: 'center' },
    statsTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.forest },
    statLabel: { fontSize: 12, color: '#4A6B59', fontStyle: 'italic', marginTop: 4 },

    // Existing Dashboard Styles (unchanged)
    bentoGrid: { flexDirection: "row", gap: 15, marginBottom: 30, height: 140 },
    bentoMain: { flex: 2, borderRadius: 24, padding: 20, justifyContent: "flex-end", overflow: "hidden" },
    bentoMainTitle: { color: "#FFF", fontSize: 18, fontWeight: "900" },
    bentoMainSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" },
    bentoIcon: { position: "absolute", top: 15, right: 15 },
    bentoCol: { flex: 1, gap: 12 },
    bentoSmall: { flex: 1, borderRadius: 20, padding: 15, justifyContent: "center", alignItems: "center", gap: 4, borderWidth: 1 },
    bentoSmallText: { fontSize: 10, fontWeight: "800", textAlign: "center" },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },

    filterChip: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 6, 
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 12,
        borderWidth: 1,
    },

    filterText: { fontSize: 13, fontWeight: "700" },
    collectionWrapper: { flex: 1 },
    cardMargin: { marginBottom: 8 },

    // FAB Styles
    draggableFab: { position: "absolute", zIndex: 1000 },

    fabInner: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: "#1A3C34", 
        justifyContent: "center", 
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 2,
        borderColor: "#C6F062" 
    }

});

export default HomeScreen;