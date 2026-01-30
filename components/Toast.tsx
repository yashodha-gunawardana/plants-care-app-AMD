


type ToastType = "success" | "error" | "info";

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
}

const Toast = ({ visible, message, type = "info" }: ToastProps) => {
    const opacity = useRef(new Animated.Value(0)).current;
}