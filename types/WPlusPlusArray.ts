interface WPlusPlusEntry {
    type?: string | null;
    name?: string | null;
    properties: Record<string, string[]>;
}

type WPlusPlusArray = WPlusPlusEntry[];
export default WPlusPlusArray;
