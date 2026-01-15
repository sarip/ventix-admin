export const fromText = (name: string): string => {
    if (!name) return '';
    const initials = name.split(' ').map(word => word[0]).join('');
    return initials.toUpperCase();
};

export const acronym = (str: string):string => {
    let initials = str.match(/\b\w/g);
    return initials ? initials.slice(0, 2).join("").toUpperCase() : "";

}
export const randomColor = ():string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const proxyUrl = (url) => {
    const fileUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    return  `/api/proxy?url=${encodeURIComponent(fileUrl)}`;
}