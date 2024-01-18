import React, { useState } from "react";
import styled from "styled-components";
import SettingItems from "./settingItems";
import SettingsList from "./settingsList";
import SettingsPage from "./settingsPage";


const Container = styled.div`
    display: flex;
    align-items: flex-start;
    flex: 1 0 0;
`;

export default () => {
    const [selectedStep, setSelectedStep] = useState(SettingItems[0].id);

    return (
        <Container>
            <SettingsList
                selectedStep={selectedStep}
                setSelectedStep={setSelectedStep}
            />
            <SettingsPage selectedStep={selectedStep} />
        </Container>
    )
}