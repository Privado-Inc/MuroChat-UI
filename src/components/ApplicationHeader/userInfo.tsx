import React, { ReactElement } from "react";
import styled from "styled-components";
import { ReactComponent as PrivadoProfilePlaceholder } from "assets/svg/profilePrivado.svg";
import TextStyles from "uiLibrary/textStyles";
import { Colors } from "uiLibrary/index";
import { useSafeAuth } from "app/store";

const Container = styled.div`
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-bottom: 1px solid ${Colors.neutral.p30};
`;

const ProfileImageContainer = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 4px;
    background: url(<path-to-image>), ${Colors.lightGrey} 0px 0px / 100% 100% no-repeat;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
`;

const UserName = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-feature-settings: "salt" on;

    ${TextStyles.HeadlineH500Big};
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    align-self: stretch;
`;

const DetailsContent = styled.div`
    align-self: stretch;
    font-feature-settings: "salt" on;

    ${TextStyles.TextT200Regular}
    color: ${Colors.neutral.p60};
`;

const Role = styled.div`
    display: flex;
    padding: 2px 4px;
    align-items: flex-start;
    gap: 10px;
    border-radius: 4px;
    background: ${Colors.neutral.p30};

    font-feature-settings: "salt" on;
    ${TextStyles.TextT200Semibold};
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

const UserInfo = (): ReactElement => {
    const { user } = useSafeAuth();
    return (
        <Container>
            <ProfileImageContainer>
                <ProfilePic>
                    <UserProfile>{user.firstName[0]}</UserProfile>
                </ProfilePic>
            </ProfileImageContainer>
            <TextContainer>
                <UserName>
                    {user.firstName}
                    {user.lastName}
                    <Role>{user.role}</Role>
                </UserName>
                <Details>
                    <DetailsContent>{user.email}</DetailsContent>
                    {/* <DetailsContent>
                        myworkspace
                    </DetailsContent> */}
                </Details>
            </TextContainer>
        </Container>
    );
};

export default UserInfo;
