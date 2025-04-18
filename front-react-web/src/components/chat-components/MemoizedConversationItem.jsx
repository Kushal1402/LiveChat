import { formatTime } from "@/utils/dateUtils";
import React from "react";
import UserAvatar from "./UserAvatart";
import deepEqual from "deep-equal";

const MemoizedConversationItem = React.memo(
    ({ conv, selectedUser, onSelectUser }) =>
    (
        <div
            key={conv.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${selectedUser?.id === conv.id ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
            onClick={() => onSelectUser(conv)}
        >
            <UserAvatar user={conv.opponent} size="lg" />
            <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conv.opponent.name}
                    </h3>
                    <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTime(conv.lastMessage?.time)}
                    </time>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                        {conv.typingUsers ? 'Typing...' : conv.lastMessage.text}
                    </p>
                    {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    ),
    (prevProps, nextProps) => {
        const sameConv =
            prevProps.conv.id === nextProps.conv.id &&
            prevProps.conv.lastMessage?.text === nextProps.conv.lastMessage?.text &&
            prevProps.conv.unreadCount === nextProps.conv.unreadCount &&
            prevProps.conv.typingUsers?.length === nextProps.conv.typingUsers?.length;

        const sameSelected =
            prevProps.selectedUser?.id === nextProps.selectedUser?.id;

        return sameConv && sameSelected;
    }

    // (prev, next) => deepEqual(prev.conv, next.conv) // Use deep comparison
);

export default MemoizedConversationItem