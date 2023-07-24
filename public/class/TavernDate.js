
export function TavernDate(int_date) {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    let date = new Date(Number(int_date));
    return date.toLocaleString(navigator.language, options).replace(',', '');
}
