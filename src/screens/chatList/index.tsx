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

// import React, { useEffect, useState } from 'react';
// import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import moment from 'moment';

// // Import your components (assuming they exist)
// import ListHeader from './ListHeader';
// import SearchBar from './SearchBar';
// import Tabs from './Tabs';
// import ChatCard from './ChatCard';
// import RequestListCard from './RequestListCard';
// import BlockedUserCard from './BlockedUserCard';
// import EmptyState from './EmptyState';
// import { useAppDispatch, useAppSelector } from '../../hooks/redux';
// import { selectBlockedUsers, selectChatUsers, selectRequestUsers } from '../../store/selectors/chatSelectors';
// import { initializeDummyData } from '../../store/slices/chatSlice';

// // Types
// interface User {
//     id: string;
//     name: string;
//     last_name?: string;
//     email: string;
//     avatar?: string;
//     available_status: number;
// }

// interface Message {
//     id: string;
//     message?: string;
//     attachment_file?: string;
//     latitude?: number;
//     longitude?: number;
//     updated_at: string;
//     chat_id: string;
// }

// interface Chat {
//     id: string;
//     sender_id: string;
//     receiver_id: string;
//     sender: User;
//     receiver: User;
//     last_message: Message;
//     receiver_unread_messages: number;
//     pinned_by_sender: number;
//     pinned_by_receiver: number;
// }

// interface Request {
//     id: string;
//     sender: User;
//     last_message: Message;
// }

// interface BlockedUser {
//     id: string;
//     blocked_user: User;
//     status: string;
//     updated_at: string;
// }

// // Dummy Data
// const DUMMY_USERS: User[] = [
//     {
//         id: '1',
//         name: 'John',
//         last_name: 'Doe',
//         email: 'john.doe@example.com',
//         avatar: 'https://i.pravatar.cc/150?img=1',
//         available_status: 1
//     },
//     {
//         id: '2',
//         name: 'Jane',
//         last_name: 'Smith',
//         email: 'jane.smith@example.com',
//         avatar: 'https://i.pravatar.cc/150?img=2',
//         available_status: 2
//     },
//     {
//         id: '3',
//         name: 'Bob',
//         last_name: 'Johnson',
//         email: 'bob.johnson@example.com',
//         avatar: 'https://i.pravatar.cc/150?img=3',
//         available_status: 1
//     },
//     {
//         id: '4',
//         name: 'Alice',
//         last_name: 'Williams',
//         email: 'alice.williams@example.com',
//         avatar: 'https://i.pravatar.cc/150?img=4',
//         available_status: 3
//     },
//     {
//         id: '35',
//         name: 'Current',
//         last_name: 'User',
//         email: 'current.user@example.com',
//         avatar: 'https://i.pravatar.cc/150?img=35',
//         available_status: 1
//     }
// ];

// const DUMMY_MESSAGES: Message[] = [
//     {
//         id: '1',
//         message: 'Hey, how are you doing today?',
//         updated_at: new Date().toISOString(),
//         chat_id: '1'
//     },
//     {
//         id: '2',
//         message: 'Can we meet tomorrow?',
//         updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//         chat_id: '2'
//     },
//     {
//         id: '3',
//         attachment_file: 'vacation_photo.jpg',
//         updated_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
//         chat_id: '3'
//     },
//     {
//         id: '4',
//         latitude: 37.7749,
//         longitude: -122.4194,
//         updated_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
//         chat_id: '4'
//     },
//     {
//         id: '5',
//         attachment_file: 'document.pdf',
//         updated_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
//         chat_id: '5'
//     }
// ];

// const DUMMY_CHATS: Chat[] = [
//     {
//         id: '1',
//         sender_id: '1',
//         receiver_id: '35',
//         sender: DUMMY_USERS[0],
//         receiver: DUMMY_USERS[4],
//         last_message: DUMMY_MESSAGES[0],
//         receiver_unread_messages: 2,
//         pinned_by_sender: 0,
//         pinned_by_receiver: 1
//     },
//     {
//         id: '2',
//         sender_id: '35',
//         receiver_id: '2',
//         sender: DUMMY_USERS[4],
//         receiver: DUMMY_USERS[1],
//         last_message: DUMMY_MESSAGES[1],
//         receiver_unread_messages: 0,
//         pinned_by_sender: 1,
//         pinned_by_receiver: 0
//     },
//     {
//         id: '3',
//         sender_id: '3',
//         receiver_id: '35',
//         sender: DUMMY_USERS[2],
//         receiver: DUMMY_USERS[4],
//         last_message: DUMMY_MESSAGES[2],
//         receiver_unread_messages: 1,
//         pinned_by_sender: 0,
//         pinned_by_receiver: 0
//     }
// ];

// const DUMMY_REQUESTS: Request[] = [
//     {
//         id: '1',
//         sender: DUMMY_USERS[1],
//         last_message: {
//             id: '6',
//             message: 'Hi, I would like to connect with you!',
//             updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
//             chat_id: '6'
//         }
//     },
//     {
//         id: '2',
//         sender: DUMMY_USERS[3],
//         last_message: {
//             id: '7',
//             message: 'Hello, can we be friends?',
//             updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//             chat_id: '7'
//         }
//     }
// ];

// const DUMMY_BLOCKED_USERS: BlockedUser[] = [
//     {
//         id: '1',
//         blocked_user: DUMMY_USERS[2],
//         status: 'blocked',
//         updated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
//     },
//     {
//         id: '2',
//         blocked_user: DUMMY_USERS[3],
//         status: 'blocked',
//         updated_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
//     }
// ];

// const NewChatListScreen: React.FC = () => {


//     const dispatch = useAppDispatch();
//     const chatUsers = useAppSelector(selectChatUsers);
//     const requestUsers = useAppSelector(selectRequestUsers);
//     const blockedUsers = useAppSelector(selectBlockedUsers);

//     useEffect(() => {
//         // Initialize dummy data on first load
//         dispatch(initializeDummyData());
//     }, [dispatch]);

//     console.log(chatUsers, requestUsers, blockedUsers);



//     const navigation = useNavigation();
//     const [searchText, setSearchText] = useState('');
//     const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'blocked'>('chats');

//     // Dummy data state
//     const [chatLists, setChatLists] = useState({
//         chat_data: DUMMY_CHATS,
//         block_list: DUMMY_BLOCKED_USERS
//     });
//     const [requestList, setRequestList] = useState(DUMMY_REQUESTS);
//     const [userProfile, setUserProfile] = useState(DUMMY_USERS[4]); // Current user

//     // Helper function to get avatar URI
//     const getAvatarUri = (avatar?: string) => {
//         return avatar || 'https://i.pravatar.cc/150?img=default';
//     };

//     const handleDeleteChat = (name: string) => {
//         console.log(`Delete ${name}`);
//         // Implementation would go here
//     };

//     const handleTogglePin = async (type: string, id: string, isPinned: boolean) => {
//         console.log(`Toggle pin for ${type} with ID: ${id}`);
//         console.log(`Is pinned: ${isPinned ? 'Unpin' : 'Pin'}`);

//         if (type === 'chats') {
//             setChatLists(prev => ({
//                 ...prev,
//                 chat_data: prev.chat_data.map(chat => {
//                     if (chat.id === id) {
//                         return {
//                             ...chat,
//                             pinned_by_receiver: chat.receiver_id === '35' ? (isPinned ? 0 : 1) : chat.pinned_by_receiver,
//                             pinned_by_sender: chat.sender_id === '35' ? (isPinned ? 0 : 1) : chat.pinned_by_sender
//                         };
//                     }
//                     return chat;
//                 })
//             }));
//         }
//     };

//     const handleAcceptRequest = async (chatId: string) => {
//         console.log(`Accept request from ${chatId}`);
//         // Move request to chats and remove from requests
//         const request = requestList.find(req => req.last_message.chat_id === chatId);
//         if (request) {
//             const newChat: Chat = {
//                 id: chatId,
//                 sender_id: request.sender.id,
//                 receiver_id: '35',
//                 sender: request.sender,
//                 receiver: userProfile,
//                 last_message: request.last_message,
//                 receiver_unread_messages: 1,
//                 pinned_by_sender: 0,
//                 pinned_by_receiver: 0
//             };

//             setChatLists(prev => ({
//                 ...prev,
//                 chat_data: [...prev.chat_data, newChat]
//             }));

//             setRequestList(prev => prev.filter(req => req.last_message.chat_id !== chatId));
//         }
//     };

//     const handleCancelRequest = async (chatId: string) => {
//         console.log(`Cancel request from ${chatId}`);
//         setRequestList(prev => prev.filter(req => req.last_message.chat_id !== chatId));
//     };

//     const handleUnblockUser = async (chatId: string, blockedUserId: string) => {
//         console.log(`Unblock user with ID: ${chatId} and Blocked User ID: ${blockedUserId}`);
//         setChatLists(prev => ({
//             ...prev,
//             block_list: prev.block_list.filter(blocked => blocked.id !== chatId)
//         }));
//     };

//     const getMessageType = (lastMessage: Message) => {
//         if (lastMessage?.latitude && lastMessage?.longitude) {
//             return 'location';
//         }

//         if (lastMessage?.attachment_file) {
//             const fileName = lastMessage.attachment_file.toLowerCase();

//             const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
//             const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
//             const audioExtensions = ['.mp3', '.wav', '.aac', '.ogg', '.wma', '.m4a', '.flac'];
//             const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'];

//             if (imageExtensions.some(ext => fileName.endsWith(ext))) {
//                 return 'image';
//             } else if (videoExtensions.some(ext => fileName.endsWith(ext))) {
//                 return 'video';
//             } else if (audioExtensions.some(ext => fileName.endsWith(ext))) {
//                 return 'audio';
//             } else if (documentExtensions.some(ext => fileName.endsWith(ext))) {
//                 return 'document';
//             } else {
//                 return 'document';
//             }
//         }

//         return 'text';
//     };

//     const getDisplayMessage = (lastMessage: Message, messageType: string) => {
//         switch (messageType) {
//             case 'location':
//                 return 'Location';
//             case 'image':
//                 return lastMessage?.attachment_file || 'Image';
//             case 'video':
//                 return lastMessage?.attachment_file || 'Video';
//             case 'audio':
//                 return lastMessage?.attachment_file || 'Audio';
//             case 'document':
//                 return lastMessage?.attachment_file || 'Document';
//             default:
//                 return lastMessage?.message || '';
//         }
//     };

//     const renderChatItem = ({ item }: { item: Chat }) => {
//         const chatUser = item?.receiver_id === '35' ? item?.sender : item?.receiver;

//         const isPinned = (
//             (item?.receiver_id === '35' && item?.pinned_by_receiver === 1) ||
//             (item?.sender_id === '35' && item?.pinned_by_sender === 1)
//         );

//         const messageType = getMessageType(item?.last_message);
//         const displayMessage = getDisplayMessage(item?.last_message, messageType);

//         return (
//             <ChatCard
//                 avatarUrl={getAvatarUri(chatUser?.avatar)}
//                 username={`${chatUser?.name} ${chatUser?.last_name || ''}`}
//                 status={chatUser?.available_status}
//                 isPinned={isPinned}
//                 lastMessage={displayMessage}
//                 lastMessageType={messageType}
//                 lastMessageTime={moment(item?.last_message?.updated_at).format('h:mm A')}
//                 unreadCount={item?.receiver_unread_messages}
//                 onDelete={() => handleDeleteChat(`${chatUser?.name} ${chatUser?.last_name || ''}`)}
//                 onTogglePin={() => handleTogglePin('chats', item?.id, isPinned)}
//                 onPress={() => navigation.navigate('ChatScreen' as never, { chatId: item?.id } as never)}
//             />
//         );
//     };

//     const renderRequestItem = ({ item }: { item: Request }) => {
//         const messageType = getMessageType(item?.last_message);
//         const displayMessage = getDisplayMessage(item?.last_message, messageType);

//         return (
//             <RequestListCard
//                 avatarUrl={getAvatarUri(item?.sender?.avatar)}
//                 requesterName={`${item?.sender?.name} ${item?.sender?.last_name || ''}`}
//                 status={item?.sender?.available_status}
//                 requestDetails={displayMessage}
//                 requestType={messageType}
//                 requestTime={moment(item?.last_message?.updated_at).format('h:mm A')}
//                 onAccept={() => handleAcceptRequest(item?.last_message?.chat_id)}
//                 onCancel={() => handleCancelRequest(item?.last_message?.chat_id)}
//             />
//         );
//     };

//     const renderBlockedItem = ({ item }: { item: BlockedUser }) => (
//         <BlockedUserCard
//             avatarUrl={getAvatarUri(item?.blocked_user?.avatar)}
//             blockedUserName={`${item?.blocked_user?.name} ${item?.blocked_user?.last_name || ''}`}
//             blockReason={item?.blocked_user?.email}
//             status={item.status}
//             blockTime={moment(item?.updated_at).format('h:mm A')}
//             onUnblock={() => handleUnblockUser(item?.id, item?.blocked_user?.id)}
//         />
//     );

//     const countUnreadChats = (chatData: Chat[]) => {
//         let unreadChatCount = 0;
//         chatData?.forEach(chat => {
//             if (chat.receiver_unread_messages > 0) {
//                 unreadChatCount++;
//             }
//         });
//         return unreadChatCount;
//     };

//     const handleChangeStatus = async (status: number) => {
//         try {
//             const data = await AsyncStorage.getItem("userData");
//             const userInfo = data ? JSON.parse(data) : null;

//             const statusInfo = {
//                 "status_id": status,
//                 "user_id": userInfo?.id || userProfile.id
//             };

//             setUserProfile(prevProfile => ({
//                 ...prevProfile,
//                 available_status: status
//             }));

//             console.log('Status changed:', statusInfo);
//         } catch (error) {
//             console.error('Error changing status:', error);
//         }
//     };

//     const handleFilter = (text: string) => {
//         setSearchText(text);
//     };

//     // Filter data based on search text
//     const getFilteredData = () => {
//         if (!searchText.trim()) {
//             switch (activeTab) {
//                 case 'chats':
//                     return chatLists?.chat_data || [];
//                 case 'requests':
//                     return requestList || [];
//                 case 'blocked':
//                     return chatLists?.block_list || [];
//                 default:
//                     return [];
//             }
//         }

//         const searchLower = searchText.toLowerCase();

//         switch (activeTab) {
//             case 'chats':
//                 return chatLists?.chat_data?.filter(chat => {
//                     const chatUser = chat?.receiver_id === '35' ? chat?.sender : chat?.receiver;
//                     const fullName = `${chatUser?.name} ${chatUser?.last_name || ''}`.toLowerCase();
//                     return fullName.includes(searchLower);
//                 }) || [];
//             case 'requests':
//                 return requestList?.filter(request => {
//                     const fullName = `${request?.sender?.name} ${request?.sender?.last_name || ''}`.toLowerCase();
//                     return fullName.includes(searchLower);
//                 }) || [];
//             case 'blocked':
//                 return chatLists?.block_list?.filter(blocked => {
//                     const fullName = `${blocked?.blocked_user?.name} ${blocked?.blocked_user?.last_name || ''}`.toLowerCase();
//                     return fullName.includes(searchLower);
//                 }) || [];
//             default:
//                 return [];
//         }
//     };

//     const filteredData = getFilteredData();

//     return (
//         <SafeAreaView style={styles.container}>
//             <ListHeader
//                 onBackPress={() => console.log('Back pressed')}
//                 onSettingsPress={() => console.log('Settings pressed')}
//                 onStatusChange={(status) => handleChangeStatus(status)}
//                 status={userProfile?.available_status}
//             />

//             <SearchBar value={searchText} onChangeText={handleFilter} />

//             <View style={styles.tabsContainer}>
//                 <Tabs
//                     badgeData={{
//                         chats: countUnreadChats(chatLists?.chat_data || []),
//                         requests: requestList?.length || 0,
//                         blocked: chatLists?.block_list?.length || 0,
//                     }}
//                     onTabChange={(tab) => {
//                         setActiveTab(tab);
//                         setSearchText('');
//                     }}
//                 />
//             </View>

//             {/* List Section */}
//             <View style={styles.listContainer}>
//                 {activeTab === 'chats' && (
//                     <FlatList
//                         data={filteredData}
//                         renderItem={renderChatItem}
//                         keyExtractor={(item) => item.id}
//                         contentContainerStyle={styles.chatListContent}
//                         showsVerticalScrollIndicator={false}
//                         ListEmptyComponent={
//                             <EmptyState
//                                 icon="chat"
//                                 message={searchText ? "No chats found matching your search." : "No chats available."}
//                             />
//                         }
//                     />
//                 )}

//                 {activeTab === 'requests' && (
//                     <FlatList
//                         data={filteredData}
//                         renderItem={renderRequestItem}
//                         keyExtractor={(item) => item.id}
//                         contentContainerStyle={styles.requestListContent}
//                         showsVerticalScrollIndicator={false}
//                         ListEmptyComponent={
//                             <EmptyState
//                                 icon="person-add-alt"
//                                 message={searchText ? "No requests found matching your search." : "No requests at the moment."}
//                             />
//                         }
//                     />
//                 )}

//                 {activeTab === 'blocked' && (
//                     <FlatList
//                         data={filteredData}
//                         renderItem={renderBlockedItem}
//                         keyExtractor={(item) => item.id}
//                         contentContainerStyle={styles.blockedListContent}
//                         showsVerticalScrollIndicator={false}
//                         ListEmptyComponent={
//                             <EmptyState
//                                 icon="block"
//                                 message={searchText ? "No blocked users found matching your search." : "No blocked users."}
//                             />
//                         }
//                     />
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// };

// export default NewChatListScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     tabsContainer: {
//         height: 50,
//     },
//     listContainer: {
//         flex: 1,
//     },
//     chatListContent: {
//         padding: 16,
//     },
//     requestListContent: {
//         padding: 16,
//     },
//     blockedListContent: {
//         padding: 16,
//     },
// });