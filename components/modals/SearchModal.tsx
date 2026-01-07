import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { X, Search, MapPin } from 'lucide-react-native';
import { searchCities, CitySearchResult } from '../../lib/geocodingService';
import { SavedCity } from '../../lib/storageService';

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
    onAddCity: (city: SavedCity) => void;
}

export default function SearchModal({ visible, onClose, onAddCity }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<CitySearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search
    useEffect(() => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const searchResults = await searchCities(searchQuery);
                setResults(searchResults);
                setLoading(false);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to search cities');
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleAddCity = (result: CitySearchResult) => {
        const city: SavedCity = {
            id: `${result.lat}_${result.lon}`,
            name: result.name,
            state: result.state,
            country: result.country,
            lat: result.lat,
            lon: result.lon,
        };
        onAddCity(city);
        setSearchQuery('');
        setResults([]);
        onClose();
    };

    const handleClose = () => {
        setSearchQuery('');
        setResults([]);
        setError(null);
        onClose();
    };

    const renderCityItem = ({ item }: { item: CitySearchResult }) => {
        const location = item.state
            ? `${item.state}, ${item.country}`
            : item.country;

        return (
            <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleAddCity(item)}
            >
                <View style={styles.resultItemContent}>
                    <MapPin size={20} color="rgba(255, 255, 255, 0.8)" />
                    <View style={styles.resultTextContainer}>
                        <Text style={styles.cityName}>{item.name}</Text>
                        <Text style={styles.cityLocation}>{location}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />

                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add City</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <Search size={20} color="rgba(255, 255, 255, 0.6)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a city..."
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Results */}
                    <View style={styles.resultsContainer}>
                        {loading && (
                            <View style={styles.centerContent}>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        )}

                        {error && (
                            <View style={styles.centerContent}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {!loading && !error && searchQuery.length >= 2 && results.length === 0 && (
                            <View style={styles.centerContent}>
                                <Text style={styles.emptyText}>No cities found</Text>
                            </View>
                        )}

                        {!loading && !error && searchQuery.length < 2 && (
                            <View style={styles.centerContent}>
                                <Text style={styles.hintText}>Type at least 2 characters to search</Text>
                            </View>
                        )}

                        {!loading && !error && results.length > 0 && (
                            <FlatList
                                data={results}
                                renderItem={renderCityItem}
                                keyExtractor={(item) => `${item.lat}_${item.lon}`}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        height: '80%',
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: 'white',
    },
    resultsContainer: {
        flex: 1,
    },
    resultItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    resultItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    cityName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    cityLocation: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
    },
    hintText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
        textAlign: 'center',
    },
});
