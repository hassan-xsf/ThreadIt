/// YOINKED FROM GPT :X



export default function timeAgo(timestamp: string | Date): string {
    const now = new Date();
    const pastDate = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const differenceInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
    
    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(differenceInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}
