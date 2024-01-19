import { ReactComponent as UserProvisioningIcon } from "assets/svg/userProvisioning.svg";
import { ReactComponent as ModelConfigurationIcon } from "assets/svg/modelConfiguration.svg";
import { ReactComponent as SSOSetup } from "assets/svg/setup.svg";
import React from "react";

export default [
    {
        id: "step4",
        name: "Overview",
        icon: <SSOSetup />,
        description: ""
    },
    {
        id: "step1",
        name: "Okta Set-up",
        icon: <SSOSetup />,
        description: "Set-up Okta to get Okta User Groups"
    },
    {
        id: "step2",
        name: "User Provisioning",
        icon: <UserProvisioningIcon />,
        description: "Map Okta User Groups to MuroChat Roles"
    },
    {
        id: "step3",
        name: "Model Configurations",
        icon: <ModelConfigurationIcon />,
        description: "Set-up LLM Models to use them in MuroChat"
    }
];
