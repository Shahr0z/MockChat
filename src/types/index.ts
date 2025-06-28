export interface ChatUser {
    id: string;
    name: string;
    last_name: string;
    email: string;
    avatar: string;
    available_status: number;
    message: {
        id: string;
        message?: string;
        attachment_file?: string;
        latitude?: number;
        longitude?: number;
        updated_at: string;
        chat_id: string;
    };
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    sender: string;
    receiver: string;
    last_message: string;
    receiver_unread_messages: number;
    pinned_by_sender: number;
    pinned_by_receiver: number;
    pinned_Time: string | null;
    requestStatus: 'pending' | 'accepted' | 'rejected';
    blockStatus: 'blocked' | 'unblocked';
    userType: 'chat' | 'request' | 'blocked';
}

export interface ChatMessage {
    id: string;
    message?: string;
    timestamp: string;
    sender_id: string;
    receiver_id: string;
    chat_id: string;
    message_type: 'text';
    is_read: boolean;
}

export interface ChatState {
    currentUserId: string;
    users: ChatUser[];
    messages: ChatMessage[];
    activeChat: string | null;
    loading: boolean;
    error: string | null;
}