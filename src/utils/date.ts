import {formatDistanceToNow} from "date-fns";
import {id} from "date-fns/locale";

export const convertUnixTimestampToDate = (timestamp: number): string => {
    // const date = new Date(timestamp * 1000);
    // return date.toLocaleString('id-ID', { hour12: false });
    const date = new Date(timestamp * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export function unixToRelativeTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to JavaScript Date object
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
}