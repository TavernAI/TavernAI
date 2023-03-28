export default interface ChatMessage {
    chid?: number;
    create_date?: number;
    is_name: boolean;
    is_user: boolean;
    notes?: string;
    notes_type?: string;
    mes: string;
    name: string;
    send_date?: number;
}
