import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search conversations...',
    value,
    onChangeText,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, isFocused && styles.containerFocused]}>
            <Icon
                name="search"
                size={20}
                color={isFocused ? '#3B82F6' : '#6B7280'}
                style={styles.icon}
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 14,
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    containerFocused: {
        backgroundColor: '#F3F4F6',
        borderColor: '#3B82F6',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
});
