export default interface ChatMessage {
    create_date?: number;
    is_name: boolean;
    is_user: boolean;
    mes: string;
    name: string;
    send_date?: number;
}
