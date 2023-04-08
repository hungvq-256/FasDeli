export function json2xml(obj) {
    var xml = "";
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? "" : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += json2xml(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += json2xml(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? "" : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
    return xml;
}
export function xml2json(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
    }

    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
        return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
        obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
            return text + node.nodeValue;
        }, "");
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xml2json(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xml2json(item));
            }
        }
    }
    return obj;
}

export function downloadXMLFile(xml) {
    var filename = "file.xml";
    var elm = document.createElement("a");
    var bb = new Blob([xml], { type: "text/plain" });
    elm.setAttribute("href", window.URL.createObjectURL(bb));
    elm.setAttribute("download", filename);
    elm.dataset.downloadurl = ["text/plain", elm.download, elm.href].join(":");
    elm.draggable = true;
    elm.classList.add("dragout");
    elm.click();
    elm.remove();
}