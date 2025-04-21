import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';
import memoize from 'lodash.memoize';


export const formatTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return '';

  // For messages within the last 24 hours
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // For older messages
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

// Advanced version with relative time formatting
export const formatMessageTime = memoize((dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return '';

  const now = new Date();
  const diffInSeconds = Math.round((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }

  if (diffInSeconds < 86400) {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  if (diffInSeconds < 604800) {
    return date.toLocaleDateString([], { weekday: 'short' }); // e.g., "Mon"
  }

  return date.toLocaleDateString(); // e.g., "4/12/2024"
}, (dateString) => {
  const date = new Date(dateString);
  return isNaN(date)
    ? ''
    : `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
});


export const formatLastSeen = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInDays = differenceInDays(now, date);

  if (isToday(date)) {
    return `Today ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return format(date, 'dd MMM');
  }
}


