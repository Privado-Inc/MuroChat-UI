import React, { ReactElement, useEffect, useState } from "react";
import { getMetaForApp } from "services/meta";
import { BrowserRouter as Router } from "react-router-dom";
import { Loader, Error as ErrorView } from "uiLibrary/components";
import { QueryClientProvider } from "react-query";
import queryClient from "./QueryClient";
import App from "./routes";
import { AuthProvider } from "./store";

export default (): ReactElement => {
    const [idpConfiguration, setIdpConfiguration] = useState<
        | {
              domain: string;
              clientId: string;
          }
        | undefined
    >(undefined);

    useEffect(() => {
        (async () => {
            const response = await getMetaForApp();
            if (response.ok) {
                (window as any).asdidpasd = {
                    ...((window as any).asdidpasd || {}),
                    okta: {
                        enabled: true,
                        clientId: response.data.clientId,
                        domain: response.data.domain
                    }
                };
                setIdpConfiguration({
                    clientId: response.data.clientId,
                    domain: response.data.domain
                });
                return;
            }
            setIdpConfiguration({
                clientId: "",
                domain: ""
            });
        })();
    }, []);

    if (!idpConfiguration) {
        return <Loader />;
    }

    if (!idpConfiguration.clientId || !idpConfiguration.domain) {
        return <ErrorView />;
    }

    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </Router>
    );
};
