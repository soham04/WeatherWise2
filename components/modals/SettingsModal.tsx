import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { X, Thermometer } from "lucide-react-native";
import { TemperatureUnit } from "../../lib/preferencesService";

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    temperatureUnit: TemperatureUnit;
    onTemperatureUnitChange: (unit: TemperatureUnit) => void;
}

export const SettingsModal = ({
    visible,
    onClose,
    temperatureUnit,
    onTemperatureUnitChange,
}: SettingsModalProps) => {
    const handleUnitChange = (unit: TemperatureUnit) => {
        onTemperatureUnitChange(unit);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Settings</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Temperature Unit Setting */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Thermometer size={20} />
                            <Text style={styles.sectionTitle}>Temperature Unit</Text>
                        </View>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    temperatureUnit === "F" && styles.toggleButtonActive,
                                ]}
                                onPress={() => handleUnitChange("F")}
                            >
                                <Text
                                    style={[
                                        styles.toggleText,
                                        temperatureUnit === "F" && styles.toggleTextActive,
                                    ]}
                                >
                                    °F
                                </Text>
                                <Text
                                    style={[
                                        styles.toggleLabel,
                                        temperatureUnit === "F" && styles.toggleLabelActive,
                                    ]}
                                >
                                    Fahrenheit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    temperatureUnit === "C" && styles.toggleButtonActive,
                                ]}
                                onPress={() => handleUnitChange("C")}
                            >
                                <Text
                                    style={[
                                        styles.toggleText,
                                        temperatureUnit === "C" && styles.toggleTextActive,
                                    ]}
                                >
                                    °C
                                </Text>
                                <Text
                                    style={[
                                        styles.toggleLabel,
                                        temperatureUnit === "C" && styles.toggleLabelActive,
                                    ]}
                                >
                                    Celsius
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(30, 30, 50, 0.95)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "white",
    },
    closeButton: {
        padding: 4,
    },
    section: {
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.8)",
    },
    toggleContainer: {
        flexDirection: "row",
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    toggleButtonActive: {
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderColor: "rgba(59, 130, 246, 0.6)",
    },
    toggleText: {
        fontSize: 32,
        fontWeight: "700",
        color: "rgba(255, 255, 255, 0.5)",
        marginBottom: 4,
    },
    toggleTextActive: {
        color: "white",
    },
    toggleLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.4)",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    toggleLabelActive: {
        color: "rgba(255, 255, 255, 0.8)",
    },
});

export default SettingsModal;
