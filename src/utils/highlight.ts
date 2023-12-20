import hljs from "highlight.js";

export function highlightCode() {
    document.querySelectorAll("pre code").forEach((el: any) => {
        hljs.highlightElement(el);
    });
}
