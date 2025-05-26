import { useEffect, useRef } from "react"
// Import Avatar components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserAvatar from "./UserAvatart"
import { TbChecks, TbCheck } from "react-icons/tb";
import { useMobileView } from "@/hooks/use-mobile-view";
import { useSelector } from "react-redux";
import { selectActiveConversationMessages, selectConversationMessages } from "@/store/slices/chatSlice";

export default function ChatMessages({ activeConversation }) {

  const conversionMessages = useSelector(selectConversationMessages);

  const activeMessages = useSelector(selectActiveConversationMessages);
  console.log('activeMessages: ', activeMessages);


  const messagesEndRef = useRef(null)
  const isMobile = useMobileView()

  const { user } = useSelector((state) => state.auth)


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversionMessages])

  // Group messages by date
  const groupedMessages = {}




  console.log("conversionMessages: ", conversionMessages);

  /////////////////////////////////// /////////////////////////////////////////////////////

  // Format time (e.g., "2:30 PM")
  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Check if date is today
  const isToday = (date) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  // Check if date is yesterday
  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(date).toDateString() === yesterday.toDateString();
  };

  // Format date header (e.g., "Today", "Yesterday", or "Mon May 27, 2025")
  const formatGroupDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString(); // Use createdAt from your message

      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });

    // Sort messages within each date group
    Object.keys(groupedMessages).forEach((date) => {
      groupedMessages[date].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return groupedMessages;
  };

  const processMessages = (messages) => {
    const grouped = groupMessagesByDate(messages);

    return Object.entries(grouped).map(([dateString, messages]) => ({
      dateHeader: formatGroupDate(dateString),
      messages: messages.map(msg => ({
        ...msg,
        formattedTime: formatMessageTime(msg.createdAt) // Add formatted time to each message
      }))
    }));
  };

  const processedMessages = processMessages(conversionMessages);

  console.log(processedMessages);




  return (
    <div className={`flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800`}>
      {processedMessages?.map(({ index, dateHeader, messages }) => (
        <div key={index}>
          {/* Date header */}
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {dateHeader || 'invalid'}
            </span>
          </div>

          {/* Messages */}
          {messages?.map((message) => {
            const isMe = message.sender._id === user._id;
            return (
              <div
                key={message._id}
                className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Sender avatar (left side for received messages) */}
                {!isMe && (
                  <div className="mr-2 mt-1">
                    <UserAvatar
                      user={message.sender}
                      src={message.sender.profile_picture}
                      fallback={message.sender.username.charAt(0)}
                    />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-[75%] ${isMe
                    ? "bg-primary text-primary-foreground dark:bg-gray-700"
                    : "bg-white dark:bg-gray-700"
                    } rounded-lg p-3 shadow ${isMe ? "rounded-tr-none" : "rounded-tl-none"
                    }`}
                >
                  <p className="text-gray-900 dark:text-gray-100">
                    {message.content}
                  </p>

                  {/* Message footer (time + read receipts) */}
                  <div
                    className={`text-xs mt-1 flex items-center ${isMe ? "justify-end" : "justify-start"
                      } ${isMe ? "text-gray-300 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {formatMessageTime(message.createdAt)}
                    {isMe && (
                      <span className="ml-1">
                        {message.readBy?.length > 0 ? (
                          <TbChecks className="w-4 h-4 text-blue-500" />
                        ) : (
                          <TbCheck className="text-gray-500 dark:text-gray-300 w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* My avatar (right side for sent messages) */}
                {isMe && !isMobile && (
                  <div className="ml-2 mt-1">
                    <UserAvatar
                      user={user}
                      src={user.profile_picture}
                      fallback={user.username.charAt(0)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}



