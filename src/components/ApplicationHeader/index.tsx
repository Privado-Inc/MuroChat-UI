import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as PrivadoLogo } from "assets/svg/profilePrivado.svg";
// import { ReactComponent as PrivadoLogoText } from "assets/svg/privadoLogoText.svg";
import { ReactComponent as PrivadoProfilePlaceholder } from "assets/svg/profilePrivado.svg";
import { ReactComponent as CaretDownLightIcon } from "assets/svg/caretDownLight.svg";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import colors from "uiLibrary/colors";
import { useSafeAuth } from "app/store";
import ProfileLayout from "./profileLayout";

const HeaderContainer = styled.div`
    width: 100%;
    height: 56px;
    padding: 5px 16px;
    display: flex;
    justify-content: space-between;
    background: #0c1425;
    border-bottom: 1px solid ${Colors.neutral.p70};
`;

const PrivadoLogoText = styled.span`
    ${TextStyles.HeadlineH300Semibold};
    color: ${Colors.white};
`;

const LogoContainer = styled.div`
    width: 134px;
    height: 24px;
    margin-right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & svg:first-child {
        border-radius: 5px;
    }
`;

const LineContainer = styled.div`
    padding: 0px 12px;
    height: 80%;
`;

const ProfileContainer = styled.div`
    padding: 6px 4px;
    height: 34px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
`;

const RightContainer = styled.div`
    width: auto;
    display: flex;
    align-items: center;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 20%;
`;

const Line = styled.div`
    width: 2px;
    height: 100%;
    border-radius: 4px;
    background: ${colors.neutral.p70};
`;

const ProfileTexts = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 12px;
    margin-right: 12px;
    color: ${Colors.white};
`;

const ProfileName = styled.span`
    ${TextStyles.TextT300Semibold};
    color: ${Colors.white};
`;

const ProfileSubText = styled.span`
    ${TextStyles.TextT300Regular}
    color: ${Colors.white};
`;

const ProfilePic = styled.span`
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    border-radius: 2px;
`;

const UserProfile = styled.span`
    background: ${Colors.purple.p50};
    color: ${Colors.white};
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
`;

const Header = (): ReactElement => {
    const { user } = useSafeAuth();
    const [showPanel, setShowPanel] = useState(false);
    const container = React.createRef<HTMLDivElement>();

    const onWindowClick = (e: any): void => {
        if (container.current && !container.current.contains(e.target)) {
            setShowPanel(false);
        }
    };

    useEffect(() => {
        window.addEventListener("click", onWindowClick);
        return () => {
            window.removeEventListener("click", onWindowClick);
        };
    }, [container]);

    return (
        <HeaderContainer>
            <LeftContainer>
                <LogoContainer>
                    <PrivadoLogo />
                    <PrivadoLogoText>MuroChat</PrivadoLogoText>
                </LogoContainer>
            </LeftContainer>
            <RightContainer>
                <LineContainer>
                    <Line />
                </LineContainer>
                <ProfileContainer
                    ref={container}
                    onClick={() => {
                        setShowPanel(true);
                    }}
                >
                    <ProfilePic>
                        <UserProfile>{user.firstName[0]}</UserProfile>
                    </ProfilePic>
                    <ProfileTexts>
                        <ProfileName>
                            {user.firstName} {user.lastName}
                        </ProfileName>
                        <ProfileSubText>{user.email}</ProfileSubText>
                    </ProfileTexts>
                    <CaretDownLightIcon />
                    {showPanel && <ProfileLayout />}
                </ProfileContainer>
            </RightContainer>
        </HeaderContainer>
    );
};

export default Header;
