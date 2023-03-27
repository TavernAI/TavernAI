interface WPlusPlusEntry {
    type?: string;
    name?: string;
    properties: Record<string, string[]>;
}

type WPlusPlusArray = WPlusPlusEntry[];
export default WPlusPlusArray;
