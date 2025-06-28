export interface ThemeColors {
    primaryBackground: string;
    secondaryBackground: string;
    cardBackground: string;
    shadow: string;
    avatarBackground: string;
    buttonBackground: string;
    menuIconBackground: string;
    unreadBadge: string;
    primaryText: string;
    secondaryText: string;
    headerText: string;
    statusText: string;
    groupIconBorder: string;
    modalOverlay: string;
    selectedStatusBackground: string;
}

export interface StatusColors {
    online: { icon: string; label: string };
    busy: { icon: string; label: string };
    away: { icon: string; label: string };
    offline: { icon: string; label: string };
}

export const Colors = {
    light: {
        primaryBackground: '#F9FAFB',
        secondaryBackground: '#FFFFFF',
        cardBackground: '#FFFFFF',
        shadow: '#000',
        avatarBackground: '#F3F4F6',
        buttonBackground: '#F3F4F6',
        menuIconBackground: '#F3F4F6',
        unreadBadge: '#F43F5E',
        primaryText: '#1F2937',
        secondaryText: '#6B7280',
        headerText: '#111827',
        statusText: '#374151',
        groupIconBorder: '#E5E0E7',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        selectedStatusBackground: '#E8F5E9',
    },
    dark: {
        primaryBackground: '#1F2937',
        secondaryBackground: '#374151',
        cardBackground: '#374151',
        shadow: '#000',
        avatarBackground: '#4B5563',
        buttonBackground: '#4B5563',
        menuIconBackground: '#4B5563',
        unreadBadge: '#F43F5E',
        primaryText: '#F9FAFB',
        secondaryText: '#9CA3AF',
        headerText: '#F9FAFB',
        statusText: '#D1D5DB',
        groupIconBorder: '#6B7280',
        modalOverlay: 'rgba(0, 0, 0, 0.7)',
        selectedStatusBackground: '#10B981',
    },
};

export const StatusColors: StatusColors = {
    online: { icon: '#10B981', label: 'Online' },
    busy: { icon: '#8B0000', label: 'Busy' },
    away: { icon: '#FF0000', label: 'Away' },
    offline: { icon: '#6B7280', label: 'Offline' },
};

export const getThemeColors = (isDarkMode: boolean): ThemeColors => {
    return isDarkMode ? Colors.dark : Colors.light;
};