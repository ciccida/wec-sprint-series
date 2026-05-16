/**
 * MM:SS.nnn 形式の文字列を秒数（float）に変換
 */
export function parseTimeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;

    const parts = timeStr.split(':');
    if (parts.length === 2) {
        const minutes = parseFloat(parts[0]) || 0;
        const seconds = parseFloat(parts[1]) || 0;
        return minutes * 60 + seconds;
    }
    return parseFloat(timeStr) || 0;
}

/**
 * 秒数を MM:SS.nnn 形式の文字列に変換
 */
export function formatSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00.000";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(3);

    const mStr = h > 0 ? (h * 60 + m) : m;
    const sStr = parseFloat(s) < 10 ? `0${s}` : s;

    return `${mStr}:${sStr}`;
}

/**
 * 秒数を見やすい文字列（H時間 M分 S秒）に変換
 */
export function formatFriendlyTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0秒";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let result = "";
    if (h > 0) result += `${h}時間 `;
    if (m > 0 || h > 0) result += `${m}分 `;
    result += `${s}秒`;

    return result;
}
