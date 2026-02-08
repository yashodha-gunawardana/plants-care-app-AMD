import React, { useRef, useState, useEffect } from "react";
import { 
    View, StyleSheet, TouchableOpacity, Text, Platform, 
    Animated, TextInput, Dimensions, Easing 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Path, G, Ellipse, Defs, LinearGradient as SvgGrad, Stop, Circle } from "react-native-svg";
import { usePathname } from "expo-router";
import { useSearch } from "@/context/SearchContext";


const { width } = Dimensions.get("window");


const COLORS = {
    rose: "#B67E7D",
    sage: "#5DA87A",
    forest: "#2E6B46",
    jungle: "#17402A",
};


// animates a decorative vine with leaves and flowers
const FloweringVine = ({ delay, rotateRange, style, length = 180, isShort = false, searchActive }: any) => {

    // controls vine sway animation
    const swayAnim = useRef(new Animated.Value(0)).current;

    // controls interaction "bounce"
    const bounceAnim = useRef(new Animated.Value(0)).current; 

    // vine swaying animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(swayAnim, { 
                    toValue: 1, 
                    duration: 3500, 
                    easing: Easing.inOut(Easing.sin), 
                    useNativeDriver: true 
                }),
                Animated.timing(swayAnim, { 
                    toValue: 0, 
                    duration: 3500, 
                    easing: Easing.inOut(Easing.sin), 
                    useNativeDriver: true 
                }),
            ])
        ).start();
    }, []);


    // bounce when search is active
    useEffect(() => {
        Animated.spring(bounceAnim, {
            toValue: searchActive ? 1 : 0,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, [searchActive]);

    
    // interpolates swayAnim to rotate between given degrees
    const rotate = swayAnim.interpolate({ 
        inputRange: [0, 1], 
        outputRange: rotateRange 
    });
    
    // animation for flower viens
    const translateX = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, style.left < 100 ? -15 : 15]
    });


    // render the vine using SVG shapes
    return (
        <Animated.View 
            style={[
                styles.vineAnchor, 
                style, { 
                    transform: [{ rotate }, 
                    { translateX }] 
                }
            ]}>

            <Svg height={length} width="100" viewBox={`0 0 100 ${length}`}>

                <Defs>
                     {/* gradient for leaf coloring */}
                    <SvgGrad id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={COLORS.sage} /><Stop offset="100%" stopColor={COLORS.forest} />
                    </SvgGrad>
                </Defs>

                {/* main vine path */}
                <Path 
                    d={isShort 
                        ? `M50 0 Q 60 ${length/2} 50 ${length}` 
                        : `M50 0 Q 75 ${length/2} 50 ${length}`} 

                        stroke={COLORS.jungle} 
                        strokeWidth="1.2" 
                        fill="none" 
                        opacity="0.25" 
                />

                {/* leaves */}
                <Ellipse 
                    cx={getX(0.12)-5} 
                    cy={length * 0.12} 
                    rx="6" ry="3" 
                    fill="url(#leafGrad)" 
                    transform={`rotate(-15, ${getX(0.12)-5}, ${length * 0.12})`} 
                />

                <Ellipse 
                    cx={getX(0.18)+5} 
                    cy={length * 0.18} 
                    rx="5" ry="2.5" 
                    fill={COLORS.jungle} 
                    transform={`rotate(40, ${getX(0.18)+5}, ${length * 0.18})`} 
                />

                {/* llowers */}
                <G transform={`translate(${getX(0.28)}, ${length * 0.28})`}>
                    <Circle 
                        cx="-2.5" cy="-2.5" r="2.8" 
                        fill="white" 
                        stroke={COLORS.rose} 
                        strokeWidth="0.3" 
                    />
                    <Circle 
                        cx="2.5" cy="-2.5" r="2.8" 
                        fill="white" 
                        stroke={COLORS.rose} 
                        strokeWidth="0.3" 
                    />
                    <Circle cx="0" cy="0" r="1.6" fill={COLORS.rose} />
                </G>

                {/* more leaves along the vine */}
                <Ellipse 
                    cx={getX(0.42)} 
                    cy={length * 0.42} 
                    rx="7" ry="3.5" 
                    fill="url(#leafGrad)" 
                    transform={`rotate(-20, ${getX(0.42)}, ${length * 0.42})`} 
                />

                <Ellipse 
                    cx={getX(0.55)+4} 
                    cy={length * 0.55} 
                    rx="6" ry="3" 
                    fill={COLORS.jungle} 
                    transform={`rotate(30, ${getX(0.55)+4}, ${length * 0.55})`} 
                />

                <Ellipse 
                    cx={getX(0.82)-4} 
                    cy={length * 0.82} 
                    rx="7" ry="3.5" 
                    fill="url(#leafGrad)" 
                    transform={`rotate(-10, ${getX(0.82)-4}, ${length * 0.82})`} 
                />
            </Svg>
        </Animated.View>
    );

    // quadratic Bezier function to calculate X for leaves/flowers
    function getX(t: number) {
        const p0 = 50; const p1 = isShort ? 60 : 75; const p2 = 50;
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }
};


const DashboardHeader = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const [searchActive, setSearchActive] = useState(false);
    const pathname = usePathname();

    // check if search should be enabled for this screen
    const showSearchIcon = ["/home", "/wiki"].includes(pathname);

    // hide notification button on Add screen
    const showNotificationIcon = ["/home", "/log"].includes(pathname);

    // animation values for header title
    const titleFade = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(10)).current;

    const tabs = [
        { name: "home", icon: "home-outline", title: "Dashboard" },
        { name: "wiki", icon: "book-outline", title: "Plants Wiki" },
        { name: "add", icon: "add-circle-outline", title: "Add Plants" },
        { name: "log", icon: "leaf-outline", title: "Water Log" },
        { name: "settings", icon: "settings-outline", title: "Settings" }
    ];

    // determines header title based on current route
    const getHeaderTitle = (path: string) => {
        if (path === "/" || path === "/index") return "Gardino";

        // get last segment of the path
        const lastSegment = path.split("/").filter(Boolean).pop() || "home";

        // find a matching tab by name
        const matchedTab = tabs.find(tab => tab.name.toLowerCase() === lastSegment.toLowerCase());
        if (matchedTab) return matchedTab.title;

        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };


    // animate header title whenever route changes
    useEffect(() => {
        titleFade.setValue(0); titleSlide.setValue(10);
        Animated.parallel([
            Animated.timing(titleFade, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(titleSlide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
        ]).start();
    }, [pathname]);


    return (
        <View style={styles.master}>
            <View style={styles.floatingCard}>

                 {/* decorative vines */}
                <View style={styles.vineLayer} pointerEvents="none">
                    <FloweringVine 
                        searchActive={searchActive} 
                        delay={0} 
                        rotateRange={["-2deg", "2deg"]} 
                        style={{ left: 10 }} 
                        length={230} 
                    />

                    <FloweringVine 
                        searchActive={searchActive} 
                        delay={1200} 
                        rotateRange={["-1.5deg", "1.5deg"]} 
                        style={{ left: width / 2 - 50 }} 
                        length={90} isShort 
                    />

                    <FloweringVine 
                        searchActive={searchActive} 
                        delay={600} 
                        rotateRange={["2deg", "-2deg"]} 
                        style={{ right: 10 }} 
                        length={210} 
                    />
                </View>

                <View style={styles.inner}>
                    {!searchActive ? (
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.estText}>EST. 2026</Text>

                                <Animated.Text 
                                    key={pathname} 
                                    style={[styles.brand, { 
                                        opacity: titleFade, 
                                        transform: [{ translateY: titleSlide }] 
                                    }]}>

                                    {getHeaderTitle(pathname)}
                                </Animated.Text>
                            </View>

                             {/* search and notification buttons */}
                            <View style={styles.btnBox}>

                                {showSearchIcon && (
                                    <TouchableOpacity onPress={() => setSearchActive(true)} style={styles.iconBtn}>
                                        <Ionicons name="search" size={20} color={COLORS.jungle} />
                                    </TouchableOpacity>
                                )}
                                
                                {showNotificationIcon && (
                                    <TouchableOpacity style={styles.iconBtn}>
                                        <Ionicons name="notifications-outline" size={20} color={COLORS.jungle} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                    ) : (
                         // search input when search is active
                        <Animated.View style={[styles.searchBox, { opacity: titleFade }]}>
                            <BlurView intensity={20} style={styles.pill}>

                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Search plants..." 
                                    value={searchQuery} 
                                    onChangeText={setSearchQuery} 
                                    autoFocus 
                                    placeholderTextColor={COLORS.forest} 
                                />

                                
                                <TouchableOpacity onPress={() => { setSearchActive(false), setSearchQuery("")}}>
                                    <Ionicons name="close-circle" size={24} color={COLORS.jungle} style={{ marginRight: 15 }} />
                                </TouchableOpacity>
                            </BlurView>
                        </Animated.View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    master: {
        paddingTop: Platform.OS === "ios" ? 50 : 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        zIndex: 1000,
    },
    floatingCard: {
        backgroundColor: "#FFFFFF",
        height: 100,
        borderRadius: 40,
        position: "relative",
        overflow: "visible",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
        borderColor: "#5DA87A",
        borderWidth: 1,
    },

    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, zIndex: 100 },
    vineLayer: { position: "absolute", top: -10, left: 0, right: 0, height: 350, zIndex: 1 },
    vineAnchor: { position: "absolute", top: 0, width: 100 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    estText: { color: COLORS.forest, fontSize: 10, fontWeight: "700", letterSpacing: 2 },
    brand: { color: COLORS.jungle, fontSize: 28, fontWeight: "900" },
    btnBox: { flexDirection: "row", gap: 10 },

    iconBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: "#F9FBFA",
        justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0"
    },

    searchBox: { height: 50, justifyContent: 'center' },

    pill: {
        flexDirection: "row", alignItems: "center", borderRadius: 20,
        backgroundColor: "rgba(240, 244, 242, 0.8)",
    },

    input: { flex: 1, paddingHorizontal: 20, fontSize: 16, color: COLORS.jungle },

});


export default DashboardHeader;