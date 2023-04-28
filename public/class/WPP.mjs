export class WPP {
    static ErrorNoGroups = "No groups in this W++";
    static ErrorNoType = "Group is missing a type";
    static ErrorTypeHasMultipleNames = "Type has multiple names";
    static ErrorBadAttribute = "Could not parse attribute";
    static ErrorNotWPP = "Target is not W++";
    static ErrorNotWPPExtended = "Target is not W++ with appendix";

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
                node.format = "W++";
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
        let appendix = string;
        let candidates = string.match(/[\[{][^\]}]*[\]}]\]?/g) || [];
        let result = [];
        candidates.forEach(match => {
            try {
                let r = WPP.parse(match) || [];
                if(r.length) {
                    appendix = appendix.replace(match, "");
                    result = result.concat(r);
                }
            } catch(e) {
                // format error; do not change appendix
            }
        });
        return {
            wpp: result,
            appendix: appendix,
        };
    }

    static parseSingle(string) {
        string = string
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .replace(/\)\s*\[/g, ')[');
        let match = string
            .match(/[^(]*\([^)]*\)\[[^\]]*\]/);
        let tail = string.replace(/[^(]*\([^)]*\)\[[^\]]*\]/, "") || null;
        if(!match) {
            return {
                wpp: null,
                tail: string
            };
        }
        let splat = match[0]
            .match(/[^(]*\([^)]*\)/)[0]
            .replace(/\)/g, '')
            .split("(")
        let name = splat[0].trim();
        let value = splat[1].trim()
            .replace(/\s+/, " ")
            .replace(/^"/, "")
            .replace(/"$/, "")
        ;
        let properties = match[0]
            .replace(/[^(]*\([^)]*\)/, "")
            .trim()
            .replace(/\s+/, " ")
            .replace(/^\s*\[/, "")
            .replace(/\]\s*$/, "")
            .split("+")
            .map(v => v
                .replace(/^\s*"/, "")
                .replace(/"\s*$/, "")
            )
        ;
        return {
            wpp: {
                name: name,
                value: value,
                properties: properties
            },
            tail: tail
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

    static stringifyExtended(wppX, mode = "normal") {
        if(!wppX || !wppX.wpp) { throw WPP.ErrorNotWPPExtended; }
        const trimmed = WPP.trim(wppX.wpp);
        const str = WPP.stringify(trimmed, mode);
        return (trimmed.length && str && str.length ? str : "") + (wppX.appendix && wppX.appendix.length ? wppX.appendix : "");
    }

    static stringifySingle(wpp, mode = "normal") {
        let all = [];
        if(wpp.wpp) {
            all.push(wpp.wpp.name + "(" + wpp.wpp.value + ")" +
                JSON.stringify(wpp.wpp.properties).replace(/","/g, '"+"'));
        }
        if(wpp.tail && wpp.tail.length) {
            all.push(wpp.tail);
        }
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
            .replace(/\r/g, "")
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

    /**
     * Merges w1 into w2 and returns result. Does not change source.
     * @param w1 WPP
     * @param w2 WPP
     */
    static getMerged(w1, w2) {
        if((!w1 || !w1.length) && (!w2 || !w2.length)) { return []; }
        if(!w1 || !w1.length) { return JSON.parse(JSON.stringify(w2)); }
        if(!w2 || !w2.length) { return JSON.parse(JSON.stringify(w1)); }
        if(!Array.isArray(w1) || !Array.isArray(w1)) { throw WPP.ErrorNotWPP; }
        w1 = JSON.parse(JSON.stringify(w1));
        w2 = JSON.parse(JSON.stringify(w2));
        w1.forEach(acceptor => {
            if(acceptor.type && acceptor.type.length && acceptor.name && acceptor.name.length) {
                for(let j = 0; j < w2.length; j++) {
                    const donor = w2[j];
                    if(donor.type === acceptor.type && donor.name === acceptor.name) {
                        for(let key in donor.properties) {
                            if(acceptor.properties[key]) {
                                acceptor.properties[key] = acceptor.properties[key]
                                    .concat(donor.properties[key])
                                    .filter((v, i, a) => a.indexOf(v) === i)
                            } else {
                                acceptor.properties[key] = donor.properties[key];
                            }
                        }
                        w2.splice(j, 1);
                        break;
                    }
                }
            }
        });
        return w1.concat(w2);
    }

    static getMergedExtended(w1X, w2X) {
        if(!w1X || !w1X.wpp || !w2X || !w2X.wpp) { throw this.ErrorNotWPPExtended; }
        let wX = WPP.getMerged(w1X.wpp, w2X.wpp);
        let appendix = (w1X.appendix && w1X.appendix.length ? w1X.appendix : "") +
            (w1X.appendix && w1X.appendix.length && w2X.appendix && w2X.appendix.length ? "\n" : "") +
            (w2X.appendix && w2X.appendix.length ? w2X.appendix : "");
        return { wpp: wX, appendix: appendix.length ? appendix : null };
    }

    /**
     * Removes all empty items from WPP
     * @param wpp Source W++ to trim
     */
    static trim(wpp) {
        if(!Array.isArray(wpp) || !Array.isArray(wpp)) { throw WPP.ErrorNotWPP; }
        wpp = JSON.parse(JSON.stringify(wpp));
        for(let i = 0; i < wpp.length; i++) {
            if((!wpp[i].name || !wpp[i].name.length) && (!wpp[i].name || !wpp[i].name.length)) {
                wpp.splice(i, 1);
                i--;
            }
        }
        return wpp;
    }
}