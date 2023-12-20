import React, { ReactElement } from "react";
import { UserIconWrapper, UserInitials } from "./styled";

type Props = {
    value: string;
};

const computeInitials = (value: string): string => {
    const valueArr = value.split(" ");
    let initials = "";
    valueArr.forEach((word) => {
        initials += word.substring(0, 1);
    });
    return initials.substring(0, 2).toUpperCase();
};

const UserIcon = ({ value }: Props): ReactElement => {
    const [userInitials, setUserInitials] = React.useState<string>("");

    React.useEffect(() => {
        setUserInitials(computeInitials(value));
    }, [value]);

    return (
        <UserIconWrapper
            mainInitial={userInitials.substring(0, 1)}
            title={value}>
            <UserInitials> {userInitials} </UserInitials>
        </UserIconWrapper>
    );
};

export default UserIcon;
