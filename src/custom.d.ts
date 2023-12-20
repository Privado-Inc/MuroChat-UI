declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default src;
}

declare namespace React {
    import { DOMAttributes } from "react";

    interface HTMLAttributes<T> extends DOMAttributes<T> {
        css?: any;
    }
}

interface Window {
    appState: any;
    cache: any;
    token: string | null;
    idToken: string | null;
    module: { hot: any };
    isNaN: (a: string) => boolean;
    grecaptcha: any;
    Intercom: any;
}

declare module "*paths-js/path";
