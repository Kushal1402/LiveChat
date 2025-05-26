import { formatTime } from "@/utils/dateUtils";
import React from "react";
import UserAvatar from "./UserAvatart";
import deepEqual from "deep-equal";

const MemoizedConversationItem = React.memo(
    ({ conv, activeConversation, onSelectConversation }) =>
    (
        <div
            key={conv.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${activeConversation?.id === conv.id ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
            onClick={() => onSelectConversation(conv)}
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
                        {conv.typingUsers ? 'Typing...' : ( conv.lastMessage?.content)}
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
    // (prevProps, nextProps) => {
    //     const sameConv =
    //         prevProps.conv.id === nextProps.conv.id &&
    //         prevProps.conv.lastMessage?.text === nextProps.conv.lastMessage?.text &&
    //         prevProps.conv.unreadCount === nextProps.conv.unreadCount &&
    //         prevProps.conv.typingUsers?.length === nextProps.conv.typingUsers?.length &&
    //         // prevProps.conv?.opponent?.isOnline === nextProps.conv?.opponent?.isOnline
    //         // prevProps.conv?.opponent?.name  === nextProps.conv?.opponent?.name && 
    //         // prevProps.conv?.opponent?.avatar  === nextProps.conv?.opponent?.avatar 
    //         prevProps.conv?.opponent  === nextProps.conv?.opponent



    //     const sameSelected =
    //         prevProps.activeConversation?.id === nextProps.activeConversation?.id;

    //     return sameConv && sameSelected;
    // }

    (prevProps, nextProps) => 
        deepEqual(prevProps.conv, nextProps.conv) && 
        prevProps.activeConversation?.id === nextProps.activeConversation?.id
);

export default MemoizedConversationItem