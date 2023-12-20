import "regenerator-runtime/runtime";

import React from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { Colors, TextStyles } from "./uiLibrary";
import App from "./app";

const GlobalStyle = createGlobalStyle`
    html * {
        ${TextStyles.TextT200Regular};
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        outline: none;
        border: none;
        color: unset;
        text-decoration: none !important;
        font-family: IBM Plex Sans;
    }
    
    html,
    body {
        height: 100%;
        margin: 0;
        overflow: hidden;
        background-color: ${Colors.white}
    }

    #body {
        height: 100%;
        min-height: 100vh;
    }
    #holder {
        .text-red {
            color: ${Colors.red.p3} !important;
        }
    }

    a:active {
        color: unset
    }
    .grecaptcha-badge { visibility: hidden; }

    @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
    @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
    @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

    @media only print {
        html * {
            overflow: visible !important;
        }
        .skip-print{
            display: none !important;
        }
        .add-print{
            display: block !important;
        }
        @page {
            size: portrait;
            margin: 0;
        }
    }
`;
const container = document.getElementById("body");
const root = createRoot(container as HTMLElement);

root.render(
    <>
        <GlobalStyle />
        <App />
    </>
);
