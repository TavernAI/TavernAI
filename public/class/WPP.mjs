export class WPP {
    static ErrorNoGroups = "No groups in this W++";
    static ErrorNoType = "Group is missing a type";
    static ErrorTypeHasMultipleNames = "Type has multiple names";
    static ErrorBadAttribute = "Could not parse attribute";

    static Reg = new RegExp(/([)}] *[^\({ ]*)( +)([^\({]*[\({])/g);

    /**
     * Attempts to parse string in W++ format into a JSON
     * @param string
     * @returns {type: string, name: string, properties: { [key: string]: string[]}}}[]
     */
    static parse(string) {
        let wpp = [];

        string = WPP.removeExtraSpaces(string);

        let matches = string.match(/\[?[^}]*}\]?/g);
        if(!matches || !matches.length) { throw { error: WPP.ErrorNoGroups, value: null }; }
        for(let i = 0; i < matches.length; i++) {
            let node = {};
            const fragment = matches[i];
            let type = fragment.match(/[^{]*/);
            if(!type || !type.length) { throw { error: WPP.ErrorNoType, value: i }; }
            try {
                let tW = WPP.breakAttribute(type[0].replace(/^\[/, ""));
                node.type = tW.name;
                node.name = tW.value[0];
                if(tW.value.length > 1) { throw { error: WPP.ErrorTypeHasMultipleNames, value: type }; }
            } catch(e) {
                throw(e);
            }
            let vals = fragment.match(/\{.*\}/);
            node.properties = {};
            if(vals && vals.length) {
                let subs = vals[0].replace(/^\{/, "").replace(/\}$/, "").match(/[^),][^)]*\)/g);
                if(subs && subs.length) {
                    for(let j = 0; j < subs.length; j++) {
                        try {
                            const p = WPP.breakAttribute(subs[j]);
                            if(node.properties[p.name]) {
                                node.properties[p.name] = node.properties[p.name].concat(p.value);
                            } else {
                                node.properties[p.name] = p.value;
                            }
                        } catch(e) { throw e; }
                    }
                }
            }
            wpp.push(node);
        }
        return wpp;
    }

    static parseExtended(string) {
        let appendix = string.replace(/[\[{][^\]}]*[\]}]\]?/g, "") || null;
        if(appendix) {
            appendix = appendix.replace(/^\s*[\r\n]/gm, "\n")
        }
        let matches = string.match(/[\[{][^\]}]*[\]}]\]?/g);
        if(!matches) {
            throw { error: WPP.ErrorNoGroups, value: string };
        }
        let wpp = WPP.parse(matches ? matches.join("\n") : null);
        return {
            wpp: wpp,
            appendix: appendix,
        };
    }

    static stringify(wpp, mode = "normal") {
        if(!Array.isArray(wpp)) {
            wpp = [ wpp ];
        }
        let all = [];
        wpp.forEach(obj => {
            let str = ""
            str += "[" + (obj.type ? obj.type : "") + "(\"" + (obj.name ? obj.name : "") + "\"){" + "\n" ;
            for(let key in obj.properties) {
                if((!key || !key.length) && !obj.properties[key].filter(v=>v && v.length).length) {
                    continue;
                }
                str += key + "(" + obj.properties[key].filter(v=>v && v.length).map(v=>'"'+v+'"').join("+") + ")" + "\n";
            }
            str += "}]";
            all.push(str);
        });
        all = all.join("\n");
        switch(mode) {
            case "line":
                return all.replace(/\n/g, "");
            case "compact":
                return WPP.removeExtraSpaces(all);
        }
        return all;
    }

    static validate(wpp) {
        return WPP.parse(WPP.stringify(wpp));
    }

    static removeExtraSpaces(text) {
        text = text.replace(/[\r\n]/g, "");
        let match;
        while ((match = WPP.Reg.exec(text)) !== null) {
            text = text.replace(WPP.Reg, "$1#$3");
        }
        return text
            .replace(/\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g, "")
            .replace(/#/g, " ")
        ;
    }

    static breakAttribute(str) {
        str = str.trim();
        if(!str.match(/^[^\(]*\([^\)]*\)$/)) { throw { error: WPP.ErrorBadAttribute, value: str } }
        let attr = str.split("(")[0];
        let vals = str.replace(/^[^\(]*\(/, "").replace(/\)$/, "")
            .split("+").map(v => v.replace(/^"/, "").replace(/"$/, ""));
        vals.map(v => v.charAt(0).toUpperCase() + v.slice(1));
        return {
            name: attr,
            value: vals
        };
    }
}