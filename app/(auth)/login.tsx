import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Platform, StatusBar } from "react-native";



const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

const RAIN_DROP_COUNT = 15;

