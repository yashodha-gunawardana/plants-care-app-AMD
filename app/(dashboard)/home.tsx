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
    // White shades
    white: '#FFFFFF',
    offWhite: '#F8F9FA',
    cream: '#FEFEF6',
    paper: '#FAFAFA',
    
    // Green shades
    forest: '#1d5837',
    emerald: '#10B981',
    sage: '#9DC183',
    moss: '#8FBC8F',
    lightGreen: '#E8F5E9',
    
    // Yellow shades
    golden: '#F59E0B',
    sunshine: '#FFD700',
    honey: '#FBBF24',
    lightYellow: '#FFFBEB',
    
    // Neutrals
    charcoal: '#333333',
    lightGray: '#E5E7EB',
    
    // Status Colors
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
                            colors={[COLORS.forest, COLORS.emerald, COLORS.sage]}
                        />
                    }
                    showsVerticalScrollIndicator={false}>
                
                    {shouldShowWelcome ? (
                        // WELCOME SCREEN FOR FIRST-TIME USERS
                        <View style={styles.welcomeContainer}>

                            {/* Hero Welcome Section with Gradient Background */}
                            <View 
                                style={[
                                    styles.heroGradient, { 
                                    backgroundColor: COLORS.forest,
                                    shadowColor: COLORS.forest 
                                }]}>

                                <View style={styles.heroContent}>
                                    <View 
                                        style={[styles.heroIconCircle, { 
                                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                            borderColor: 'rgba(255, 255, 255, 0.3)' 
                                        }]}>

                                        <MaterialCommunityIcons 
                                            name="sprout" 
                                            size={70} 
                                            color={COLORS.white} 
                                        />
                                    </View>

                                    <Text style={styles.heroTitle}>Welcome to PlantCare 🌿</Text>
                                    <Text style={styles.heroSubtitle}>
                                        Your journey to becoming a plant parent starts here
                                    </Text>

                                    <View style={styles.heroPlantsRow}>
                                        <MaterialCommunityIcons name="flower-tulip" size={30} color={COLORS.white} style={styles.plantIcon} />
                                        <MaterialCommunityIcons name="cactus" size={30} color={COLORS.white} style={styles.plantIcon} />
                                        <MaterialCommunityIcons name="leaf" size={30} color={COLORS.white} style={styles.plantIcon} />
                                        <MaterialCommunityIcons name="tree" size={30} color={COLORS.white} style={styles.plantIcon} />
                                    </View>
                                </View>
                            </View>

                            {/* Welcome Message Card */}
                            <View 
                                style={[styles.welcomeMessageCard, { 
                                    backgroundColor: COLORS.white,
                                    borderColor: `${COLORS.lightGray}` 
                                }]}>

                                <Text style={[styles.welcomeMessageTitle, { color: COLORS.forest }]}>Let's grow together! 🌱</Text>
                                <Text style={[styles.welcomeMessageText, { color: COLORS.charcoal }]}>
                                    PlantCare helps you track watering schedules, light needs, and growth progress for all your green friends.
                                </Text>
                            </View>

                            {/* Quick Start Cards Grid */}
                            <View style={styles.cardsGrid}>
                                <Text style={[styles.sectionTitle, { color: COLORS.charcoal }]}>Get Started in 3 Steps</Text>
                                
                                {/* Row 1 */}
                                <View style={styles.cardsRow}>
                                    <View 
                                        style={[styles.card, { 
                                            backgroundColor: COLORS.white,
                                            borderColor: COLORS.lightGreen
                                        }]}>

                                        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightGreen }]}>
                                            <Ionicons name="add-circle" size={32} color={COLORS.forest} />
                                        </View>

                                        <Text style={[styles.cardTitle, { color: COLORS.charcoal }]}>Add Plants</Text>
                                        <Text style={[styles.cardDescription, { color: COLORS.charcoal }]}>
                                            Snap photos and add details about your plants
                                        </Text>

                                        <View style={[styles.cardNumber, { backgroundColor: COLORS.forest }]}>
                                            <Text style={[styles.cardNumberText, { color: COLORS.white }]}>1</Text>
                                        </View>
                                    </View>

                                    <View 
                                        style={[styles.card, { 
                                            backgroundColor: COLORS.white,
                                            borderColor: COLORS.lightYellow
                                        }]}>

                                        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightYellow }]}>
                                            <MaterialCommunityIcons name="calendar-clock" size={32} color={COLORS.golden} />
                                        </View>

                                        <Text style={[styles.cardTitle, { color: COLORS.charcoal }]}>Set Schedule</Text>
                                        <Text style={[styles.cardDescription, { color: COLORS.charcoal }]}>
                                            Create custom care reminders for each plant
                                        </Text>

                                        <View style={[styles.cardNumber, { backgroundColor: COLORS.forest }]}>
                                            <Text style={[styles.cardNumberText, { color: COLORS.white }]}>2</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Row 2 */}
                                <View style={styles.cardsRow}>
                                    <View 
                                        style={[styles.card, { 
                                            backgroundColor: COLORS.white,
                                            borderColor: COLORS.lightGreen
                                        }]}>

                                        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightGreen }]}>
                                            <Ionicons name="notifications" size={32} color={COLORS.forest} />
                                        </View>

                                        <Text style={[styles.cardTitle, { color: COLORS.charcoal }]}>Get Reminders</Text>
                                        <Text style={[styles.cardDescription, { color: COLORS.charcoal }]}>
                                            Never miss watering or fertilizing days
                                        </Text>

                                        <View style={[styles.cardNumber, { backgroundColor: COLORS.forest }]}>
                                            <Text style={[styles.cardNumberText, { color: COLORS.white }]}>3</Text>
                                        </View>
                                    </View>

                                    <View 
                                        style={[styles.card, { 
                                            backgroundColor: COLORS.white,
                                            borderColor: COLORS.lightYellow
                                        }]}>

                                        <View style={[styles.cardIconContainer, { backgroundColor: COLORS.lightYellow }]}>
                                            <Ionicons name="stats-chart" size={32} color={COLORS.golden} />
                                        </View>

                                        <Text style={[styles.cardTitle, { color: COLORS.charcoal }]}>Track Progress</Text>
                                        <Text style={[styles.cardDescription, { color: COLORS.charcoal }]}>
                                            Monitor growth and health over time
                                        </Text>

                                        <View style={[styles.cardNumber, { backgroundColor: COLORS.forest }]}>
                                            <Text style={[styles.cardNumberText, { color: COLORS.white }]}>4</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Features Showcase */}
                            <View style={styles.featuresSection}>
                                <Text style={[styles.sectionTitle, { color: COLORS.charcoal }]}>Why PlantCare?</Text>
                                
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.featuresScroll}
                                    contentContainerStyle={styles.featuresScrollContent}>
                                
                                    <View style={[styles.featureCard, { backgroundColor: COLORS.white, borderColor: COLORS.lightGreen }]}>
                                        <MaterialCommunityIcons name="water" size={40} color={COLORS.forest} />
                                        <Text style={[styles.featureCardTitle, { color: COLORS.charcoal }]}>Smart Watering</Text>
                                        <Text style={[styles.featureCardText, { color: COLORS.charcoal }]}>
                                            Intelligent schedules based on plant types
                                        </Text>
                                    </View>

                                    <View style={[styles.featureCard, { backgroundColor: COLORS.white, borderColor: COLORS.lightYellow }]}>
                                        <Ionicons name="sunny" size={40} color={COLORS.golden} />
                                        <Text style={[styles.featureCardTitle, { color: COLORS.charcoal }]}>Light Tracking</Text>
                                        <Text style={[styles.featureCardText, { color: COLORS.charcoal }]}>
                                            Optimize light exposure for each plant
                                        </Text>
                                    </View>

                                    <View style={[styles.featureCard, { backgroundColor: COLORS.white, borderColor: COLORS.lightGreen }]}>
                                        <MaterialCommunityIcons name="leaf" size={40} color={COLORS.forest} />
                                        <Text style={[styles.featureCardTitle, { color: COLORS.charcoal }]}>Health Monitor</Text>
                                        <Text style={[styles.featureCardText, { color: COLORS.charcoal }]}>
                                            Early detection of plant issues
                                        </Text>
                                    </View>

                                    <View style={[styles.featureCard, { backgroundColor: COLORS.white, borderColor: COLORS.lightYellow }]}>
                                        <MaterialCommunityIcons name="weather-cloudy" size={40} color={COLORS.golden} />
                                        <Text style={[styles.featureCardTitle, { color: COLORS.charcoal }]}>Seasonal Tips</Text>
                                        <Text style={[styles.featureCardText, { color: COLORS.charcoal }]}>
                                            Care advice for every season
                                        </Text>
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Call to Action Section */}
                            <View style={styles.ctaSection}>
                                <View 
                                    style={[styles.ctaCard, { 
                                        backgroundColor: COLORS.white,
                                        borderColor: COLORS.lightGray
                                    }]}>
                                    <Text style={[styles.ctaTitle, { color: COLORS.charcoal }]}>Ready to grow your garden?</Text>
                                    <Text style={[styles.ctaSubtitle, { color: COLORS.charcoal }]}>
                                        Join thousands of successful plant parents
                                    </Text>
                                    
                                    <TouchableOpacity 
                                        style={[styles.primaryCtaButton, { backgroundColor: COLORS.forest }]}
                                        onPress={() => router.push("/add" as any)}>
                                    
                                        <Ionicons name="add-circle" size={28} color={COLORS.white} />
                                        <Text style={styles.primaryCtaButtonText}>Start Adding Plants</Text>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.white} />
                                    </TouchableOpacity>
                                    
                                    <View style={styles.secondaryButtons}>
                                        <TouchableOpacity 
                                            style={[styles.secondaryCtaButton, { 
                                                backgroundColor: COLORS.white,
                                                borderColor: COLORS.forest 
                                            }]}
                                            onPress={() => router.push("/discover" as any)}>
                                        
                                            <Ionicons name="compass" size={22} color={COLORS.forest} />
                                            <Text style={[styles.secondaryCtaButtonText, { color: COLORS.forest }]}>Explore Library</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={[styles.secondaryCtaButton, { 
                                                backgroundColor: COLORS.white,
                                                borderColor: COLORS.golden 
                                            }]}
                                            onPress={() => router.push("/tips" as any)}>
                                        
                                            <Ionicons name="help-circle" size={22} color={COLORS.golden} />
                                            <Text style={[styles.secondaryCtaButtonText, { color: COLORS.golden }]}>Care Tips</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Community Stats */}
                            <View style={[styles.statsSection, { backgroundColor: COLORS.white, borderColor: COLORS.lightGray }]}>
                                <Text style={[styles.statsTitle, { color: COLORS.charcoal }]}>Join Our Growing Community</Text>
                                
                                <View style={styles.statsGrid}>

                                    <View style={styles.statItem}>
                                        <Text style={[styles.statNumber, { color: COLORS.forest }]}>10K+</Text>
                                        <Text style={[styles.statLabel, { color: COLORS.charcoal }]}>Plants Saved</Text>
                                    </View>

                                    <View style={[styles.statDivider, { backgroundColor: COLORS.lightGray }]} />
                                    
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statNumber, { color: COLORS.forest }]}>5K+</Text>
                                        <Text style={[styles.statLabel, { color: COLORS.charcoal }]}>Happy Users</Text>
                                    </View>

                                    <View style={[styles.statDivider, { backgroundColor: COLORS.lightGray }]} />
                                    
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statNumber, { color: COLORS.forest }]}>98%</Text>
                                        <Text style={[styles.statLabel, { color: COLORS.charcoal }]}>Success Rate</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Extra padding at bottom */}
                            <View style={{ height: 120 }} />
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
                            borderColor: COLORS.sunshine,
                            shadowColor: COLORS.forest 
                        }]}>
                    
                        <Ionicons name="add" size={30} color={COLORS.white} />
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Show static FAB for welcome screen */}
            {shouldShowWelcome && (
                <TouchableOpacity 
                    style={[styles.staticFab, { 
                        backgroundColor: COLORS.forest,
                        borderColor: COLORS.sunshine,
                        shadowColor: COLORS.forest 
                    }]}
                    activeOpacity={0.9}
                    onPress={() => router.push("/add" as any)}>
                
                    <Ionicons name="add" size={30} color={COLORS.white} />
                </TouchableOpacity>
            )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9F7" },
    
    // Loading State
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    loadingText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: '600',
        opacity: 0.9,
    },

    // Scroll Content
    scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
    welcomeScrollContent: { paddingBottom: 40 },

    // Welcome Screen Styles
    welcomeContainer: {
        flex: 1,
    },

    // Hero Section
    heroGradient: {
        borderRadius: 28,
        paddingVertical: 40,
        paddingHorizontal: 25,
        marginBottom: 25,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    heroContent: {
        alignItems: 'center',
    },
    heroIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 3,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 25,
        fontWeight: '500',
    },
    heroPlantsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    plantIcon: {
        opacity: 0.8,
    },

    // Welcome Message
    welcomeMessageCard: {
        borderRadius: 22,
        padding: 25,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
    },
    welcomeMessageTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 12,
    },
    welcomeMessageText: {
        fontSize: 15,
        lineHeight: 22,
    },

    // Cards Grid
    cardsGrid: {
        marginBottom: 35,
    },
    cardsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    card: {
        flex: 1,
        borderRadius: 20,
        padding: 22,
        minHeight: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 2,
    },
    cardIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    cardNumber: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardNumberText: {
        fontSize: 14,
        fontWeight: '800',
    },

    // Features Section
    featuresSection: {
        marginBottom: 35,
    },
    featuresScroll: {
        marginTop: 15,
    },
    featuresScrollContent: {
        paddingRight: 20,
        gap: 16,
    },
    featureCard: {
        width: 160,
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 2,
    },
    featureCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    featureCardText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },

    // CTA Section
    ctaSection: {
        marginBottom: 35,
    },
    ctaCard: {
        borderRadius: 24,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    ctaSubtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 25,
    },
    primaryCtaButton: {
        flexDirection: 'row',
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryCtaButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 12,
    },
    secondaryButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryCtaButton: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    secondaryCtaButtonText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Stats Section
    statsSection: {
        borderRadius: 22,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
    },

    // Shared Styles
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 15,
    },

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
        justifyContent: "center", 
        alignItems: "center",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        borderWidth: 3,
    },

    // Static FAB for welcome screen
    staticFab: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: "center",
        alignItems: "center",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
        borderWidth: 3,
        zIndex: 1000,
    }
});

export default HomeScreen;