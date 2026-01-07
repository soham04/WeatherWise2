import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { X, MapPin, Trash2 } from 'lucide-react-native';
import { CityWithWeather } from '../../lib/storageService';

interface CityListModalProps {
    visible: boolean;
    onClose: () => void;
    cities: CityWithWeather[];
    currentCityIndex: number;
    onSelectCity: (index: number) => void;
    onDeleteCity: (cityId: string) => void;
}

export default function CityListModal({
    visible,
    onClose,
    cities,
    currentCityIndex,
    onSelectCity,
    onDeleteCity,
}: CityListModalProps) {
    const handleSelectCity = (index: number) => {
        onSelectCity(index);
        onClose();
    };

    const handleDeleteCity = (cityId: string, index: number) => {
        // Prevent deleting the current location
        if (cities[index]?.isCurrentLocation) {
            return;
        }
        onDeleteCity(cityId);
    };

    const renderCityItem = ({ item, index }: { item: CityWithWeather; index: number }) => {
        const location = item.state
            ? `${item.state}, ${item.country}`
            : item.country;

        const isActive = index === currentCityIndex;
        const canDelete = !item.isCurrentLocation;

        return (
            <View style={styles.cityItemContainer}>
                <TouchableOpacity
                    style={[styles.cityItem, isActive && styles.activeCityItem]}
                    onPress={() => handleSelectCity(index)}
                >
                    <View style={styles.cityInfo}>
                        <View style={styles.cityHeader}>
                            {item.isCurrentLocation && (
                                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" style={styles.pinIcon} />
                            )}
                            <Text style={styles.cityName}>{item.name}</Text>
                        </View>
                        <Text style={styles.cityLocation}>{location}</Text>
                    </View>

                    {item.temperature !== undefined && (
                        <Text style={styles.temperature}>{Math.round(item.temperature)}°</Text>
                    )}
                </TouchableOpacity>

                {canDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCity(item.id, index)}
                    >
                        <Trash2 size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>My Cities</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Cities List */}
                    {cities.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No cities added yet</Text>
                            <Text style={styles.emptySubtext}>
                                Tap the search icon to add cities
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={cities}
                            renderItem={renderCityItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        backgroundColor: 'rgba(30, 30, 50, 0.95)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white',
    },
    closeButton: {
        padding: 4,
    },
    listContent: {
        paddingBottom: 24,
    },
    cityItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cityItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginRight: 8,
    },
    activeCityItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    cityInfo: {
        flex: 1,
    },
    cityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    pinIcon: {
        marginRight: 6,
    },
    cityName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    cityLocation: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    temperature: {
        fontSize: 32,
        fontWeight: '300',
        color: 'white',
    },
    deleteButton: {
        padding: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderRadius: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
});
