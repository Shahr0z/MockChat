import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import ListHeader from './ListHeader';
import SearchBar from './SearchBar';
import Tabs from './Tabs';
import ChatCard from './ChatCard';
import RequestListCard from './RequestListCard';
import BlockedUserCard from './BlockedUserCard';
import EmptyState from './EmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectBlockedUsers, selectChatUsers, selectRequestUsers } from '../../store/selectors/chatSelectors';
import {
    initializeDummyData,
    acceptRequest,
    rejectRequest,
    blockUser,
    unblockUser,
    removeUser,
    togglePinChat,
    markChatAsRead,
    markAsRead,
    setActiveChat
} from '../../store/slices/chatSlice';
import { ChatUser } from '../../types';

const NewChatListScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const chatUsers = useAppSelector(selectChatUsers);
    const requestUsers = useAppSelector(selectRequestUsers);
    const blockedUsers = useAppSelector(selectBlockedUsers);
    const { currentUserId } = useAppSelector(state => state.chat);

    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'blocked'>('chats');
    const [userProfile, setUserProfile] = useState({
        id: currentUserId,
        available_status: 1
    });

    useEffect(() => {
        // Initialize dummy data on first load if no data exists
        if (chatUsers.length === 0 && requestUsers.length === 0 && blockedUsers.length === 0) {
            dispatch(initializeDummyData());
        }
    }, [dispatch, chatUsers.length, requestUsers.length, blockedUsers.length]);

    // Helper function to get avatar URI
    const getAvatarUri = (avatar?: string) => {
        return avatar || 'https://i.pravatar.cc/150?img=default';
    };

    const handleDeleteChat = (userId: string) => {
        console.log(`Delete chat for user: ${userId}`);
        dispatch(removeUser(userId));
    };

    const handleTogglePin = async (userId: string, isPinned: boolean) => {
        console.log(`Toggle pin for user: ${userId}`);
        console.log(`Is pinned: ${isPinned ? 'Unpin' : 'Pin'}`);
        dispatch(togglePinChat(userId));
    };

    const handleAcceptRequest = async (userId: string) => {
        console.log(`Accept request from ${userId}`);
        dispatch(acceptRequest(userId));
    };

    const handleCancelRequest = async (userId: string) => {
        console.log(`Cancel request from ${userId}`);
        dispatch(rejectRequest(userId));
    };

    const handleUnblockUser = async (userId: string) => {
        console.log(`Unblock user with ID: ${userId}`);
        dispatch(unblockUser(userId));
    };

    const getMessageType = (lastMessage: ChatUser['message']) => {
        if (lastMessage?.latitude && lastMessage?.longitude) {
            return 'location';
        }

        if (lastMessage?.attachment_file) {
            const fileName = lastMessage.attachment_file.toLowerCase();

            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
            const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
            const audioExtensions = ['.mp3', '.wav', '.aac', '.ogg', '.wma', '.m4a', '.flac'];
            const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'];

            if (imageExtensions.some(ext => fileName.endsWith(ext))) {
                return 'image';
            } else if (videoExtensions.some(ext => fileName.endsWith(ext))) {
                return 'video';
            } else if (audioExtensions.some(ext => fileName.endsWith(ext))) {
                return 'audio';
            } else if (documentExtensions.some(ext => fileName.endsWith(ext))) {
                return 'document';
            } else {
                return 'document';
            }
        }

        return 'text';
    };

    const getDisplayMessage = (lastMessage: ChatUser['message'], messageType: string) => {
        switch (messageType) {
            case 'location':
                return 'Location';
            case 'image':
                return lastMessage?.attachment_file || 'Image';
            case 'video':
                return lastMessage?.attachment_file || 'Video';
            case 'audio':
                return lastMessage?.attachment_file || 'Audio';
            case 'document':
                return lastMessage?.attachment_file || 'Document';
            default:
                return lastMessage?.message || '';
        }
    };

    const renderChatItem = ({ item }: { item: ChatUser }) => {
        const isPinned = (
            (item.receiver_id === currentUserId && item.pinned_by_receiver === 1) ||
            (item.sender_id === currentUserId && item.pinned_by_sender === 1)
        );

        const messageType = getMessageType(item.message);
        const displayMessage = getDisplayMessage(item.message, messageType);

        return (
            <ChatCard
                avatarUrl={getAvatarUri(item.avatar)}
                username={`${item.name} ${item.last_name || ''}`}
                status={item.available_status}
                isPinned={isPinned}
                lastMessage={displayMessage}
                lastMessageType={messageType}
                lastMessageTime={moment(item.message.updated_at).format('h:mm A')}
                unreadCount={item.receiver_unread_messages}
                onDelete={() => handleDeleteChat(item.id)}
                onTogglePin={() => handleTogglePin(item.id, isPinned)}
                onPress={() => {
                    dispatch(markAsRead(item.id));
                    dispatch(markChatAsRead(item.chat_id));
                    dispatch(setActiveChat(item.chat_id));
                    navigation.navigate('ChatScreen' as never, { chatId: item.chat_id, userId: item.id } as never);
                }}
            />
        );
    };

    const renderRequestItem = ({ item }: { item: ChatUser }) => {
        const messageType = getMessageType(item.message);
        const displayMessage = getDisplayMessage(item.message, messageType);

        return (
            <RequestListCard
                avatarUrl={getAvatarUri(item.avatar)}
                requesterName={`${item.name} ${item.last_name || ''}`}
                status={item.available_status}
                requestDetails={displayMessage}
                requestType={messageType}
                requestTime={moment(item.message.updated_at).format('h:mm A')}
                onAccept={() => handleAcceptRequest(item.id)}
                onCancel={() => handleCancelRequest(item.id)}
            />
        );
    };

    const renderBlockedItem = ({ item }: { item: ChatUser }) => (
        <BlockedUserCard
            avatarUrl={getAvatarUri(item.avatar)}
            blockedUserName={`${item.name} ${item.last_name || ''}`}
            blockReason={item.email}
            status={item.blockStatus}
            blockTime={moment(item.message.updated_at).format('h:mm A')}
            onUnblock={() => handleUnblockUser(item.id)}
        />
    );

    const countUnreadChats = (chatData: ChatUser[]) => {
        return chatData.filter(chat => chat.receiver_unread_messages > 0).length;
    };

    const handleChangeStatus = async (status: number) => {
        try {
            const data = await AsyncStorage.getItem("userData");
            const userInfo = data ? JSON.parse(data) : null;

            setUserProfile(prevProfile => ({
                ...prevProfile,
                available_status: status
            }));

            console.log('Status changed:', {
                status_id: status,
                user_id: userInfo?.id || currentUserId
            });
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    const handleFilter = (text: string) => {
        setSearchText(text);
    };

    const getFilteredData = () => {
        let data: ChatUser[] = [];

        switch (activeTab) {
            case 'chats':
                data = [...chatUsers];
                break;
            case 'requests':
                data = requestUsers;
                break;
            case 'blocked':
                data = blockedUsers;
                break;
            default:
                data = [];
        }

        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            data = data.filter(user => {
                const fullName = `${user.name} ${user.last_name || ''}`.toLowerCase();
                return fullName.includes(searchLower);
            });
        }

        if (activeTab === 'chats') {
            data.sort((a, b) => {
                const aIsPinned =
                    (a.receiver_id === currentUserId && a.pinned_by_receiver === 1) ||
                    (a.sender_id === currentUserId && a.pinned_by_sender === 1);
                const bIsPinned =
                    (b.receiver_id === currentUserId && b.pinned_by_receiver === 1) ||
                    (b.sender_id === currentUserId && b.pinned_by_sender === 1);

                if (aIsPinned && !bIsPinned) return -1;
                if (!aIsPinned && bIsPinned) return 1;

                const aTime = aIsPinned ? a.pinned_Time : a.message.updated_at;
                const bTime = bIsPinned ? b.pinned_Time : b.message.updated_at;

                return new Date(bTime).getTime() - new Date(aTime).getTime();
            });
        }

        return data;
    };

    const filteredData = getFilteredData();

    return (
        <SafeAreaView style={styles.container}>
            <ListHeader
                onBackPress={() => console.log('Back pressed')}
                onSettingsPress={() => console.log('Settings pressed')}
                onStatusChange={(status) => handleChangeStatus(status)}
                status={userProfile.available_status}
            />

            <SearchBar value={searchText} onChangeText={handleFilter} />

            <View style={styles.tabsContainer}>
                <Tabs
                    badgeData={{
                        chats: countUnreadChats(chatUsers),
                        requests: requestUsers.length,
                        blocked: blockedUsers.length,
                    }}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        setSearchText('');
                    }}
                />
            </View>

            {/* List Section */}
            <View style={styles.listContainer}>
                {activeTab === 'chats' && (
                    <FlatList
                        data={filteredData}
                        renderItem={renderChatItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.chatListContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <EmptyState
                                icon="chat"
                                message={searchText ? "No chats found matching your search." : "No chats available."}
                            />
                        }
                    />
                )}

                {activeTab === 'requests' && (
                    <FlatList
                        data={filteredData}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.requestListContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <EmptyState
                                icon="person-add-alt"
                                message={searchText ? "No requests found matching your search." : "No requests at the moment."}
                            />
                        }
                    />
                )}

                {activeTab === 'blocked' && (
                    <FlatList
                        data={filteredData}
                        renderItem={renderBlockedItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.blockedListContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <EmptyState
                                icon="block"
                                message={searchText ? "No blocked users found matching your search." : "No blocked users."}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default NewChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    tabsContainer: {
        height: 50,
    },
    listContainer: {
        flex: 1,
    },
    chatListContent: {
        padding: 16,
    },
    requestListContent: {
        padding: 16,
    },
    blockedListContent: {
        padding: 16,
    },
});