export default [
    {
        id: "step1",
        name: "Okta Set-up",
        description: "Set-up Okta to get Okta Groups for MuroChat"
    },
    {
        id: "step2",
        name: "User Provisioning",
        description: "Map Okta User Groups to MuroChat Roles"
    },
    {
        id: "step3",
        name: "Model Configurations",
        description: "Enter OpenAI Model Details to use it in MuroChat"
    },
    {
        id: "step4",
        name: "Invite Employees",
        description: "Share an invite message with your employees"
    }
];

export type StepId = "step1" | "step2" | "step3" | "step4";
