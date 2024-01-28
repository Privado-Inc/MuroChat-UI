import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Loader } from "uiLibrary/components";
import { Colors, TextStyles } from "uiLibrary/index";
import { ReactComponent as ArrowUp } from "assets/svg/arrowUp.svg";
import { ReactComponent as ArrowDown } from "assets/svg/arrowDown.svg";
import PieChart, { ListOfColors } from "components/Charts/PieChart";
import LineChart from "components/Charts/LineChart";
import PieChartTable from "components/Charts/PieChartTable";
import Usage from "./Usage";
import { getStats } from "services/chat";
import { Notification } from "uiLibrary/components";
import { Stats } from "services/chatBackendUIType";

const OutsideContainer = styled.div`
    display: flex;
    padding: 20px 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    flex: 1 0 0;
    align-self: stretch;
    height: 100%;
    overflow-y: scroll;
`;

const Count = styled.div`
    font-feature-settings: 'salt' on;
    ${TextStyles.HeadlineH100Bold};
`;

const Compare = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
    width: 100px;
`;

const PercentCompareUp = styled.div<{ isUp?: boolean }>`

    color: ${Colors.green.p70};
    text-align: center;
    font-feature-settings: 'salt' on;
    ${TextStyles.HeadlineH500Big}
    color: ${({ isUp }) => (isUp ? Colors.green.p70 : Colors.red.p5)};
`;

const PercentCompareDown = styled.div`
    text-align: center;
    font-feature-settings: 'salt' on;

    ${TextStyles.HeadlineH500Big}
    color: ${Colors.red.p5};
`;

const Compare2 = styled.div`
    font-feature-settings: 'salt' on;
    ${TextStyles.TextT100SemiDark}
    color: ${Colors.neutral.p75};
`;

const SmallContainerWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    align-self: stretch;
    width: 1006px;
    
    border-radius: 10px;
    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);
`;

const SmallContainer = styled.div<{ hideLeftBorder?: boolean }>`
    display: flex;
    padding: 16px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1 0 0;

    border-left: 1px solid ${({ hideLeftBorder }) => (hideLeftBorder ? Colors.white : Colors.neutral.p40)};;
    background: ${Colors.white};
`;

const SmallContent = styled.div`
    display: flex;
    flex-direction: row;
`;

const SmallContentLeft = styled.div``;
const SmallContentRight = styled.div``;

const SmallContainerTitle = styled.div`
    font-feature-settings: 'salt' on;
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p85};
`;

const MediumContainerWrapper = styled.div`
    display: flex;
    gap: 32px;
    align-self: stretch;

    display: flex;
    width: 488px;
    align-items: flex-start;

    border-radius: 10px;
    background: ${Colors.white};
    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.118);
`;

const PieChartContainer = styled.div`
    display: flex;
    width: 490px;
    height: 256px;
`
const MediumContainer = styled.div`
    display: flex;
    width: 488px;
    padding: 12px 0px;
    flex-direction: column;
    align-items: flex-start;

    border-radius: 10px;
    background: ${Colors.white};
    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);
`;

const MediumContainerTitle = styled.div`
    display: flex;
    padding: 0px 24px;
    align-items: baseline;
    gap: 6px;
    align-self: stretch;

    font-feature-settings: 'salt' on;
    
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p85};
`;

const LargeContainerWrapper = styled.div`
    display: flex;
    padding: 12px 0px;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    width: 1006px;

    border-radius: 10px;
    background: ${Colors.white};
    box-shadow: 0px 2px 8px 0px rgba(37, 45, 51, 0.12);
`;

const LargeContainer = styled.div`
    display: flex;
    padding: 16px 24px;
    align-items: start;
    gap: 48px;
    align-self: stretch;
    flex-direction: column;
`;

const LargeContainerTitle = styled.div`
    font-feature-settings: 'salt' on;
    
    ${TextStyles.HeadlineH200Semibold};
    color: ${Colors.neutral.p100};
`;


export type MonthlyData = {
    _id?: number;
    totalMessageCount?: number;
    totalPiiCount?: number;
    activeUsers?: number;
    time?: string;
    x?: number;
    y?: number;
    label?: string;
}

export default () => {
    const [isLoading, updateLoading] = React.useState(true);
    const [activeUsersMonthly, setActiveUsersMonthly] = React.useState<MonthlyData[]>([]);
    const [promptsSentMonthly, setPromptsSentMonthly] = React.useState<MonthlyData[]>([]);
    const [dataRedactionsMonthly, setDataRedactionsMonthly] = React.useState<MonthlyData[]>([]);
    const [promptsSentDaily, setPromptsSentDaily] = React.useState<any>();
    const [dataRedactionsDaily, setDataRedactionsDaily] = React.useState<MonthlyData[]>();
    // TODO : Add loader
    const [stats, setStats] = useState<Stats>();

    useEffect(() => {
        const init = async () => {
            const response = await getStats();

            if (response.ok) {

                // PromptsSent Monthly
                setPromptsSentMonthly(response.data.monthly.map((monthlyData, index) => {
                    return {
                        x: index,
                        y: monthlyData.totalMessageCount
                    }
                }));

                // dataRedactions Monthly
                setDataRedactionsMonthly(response.data.monthly.map((monthlyData, index) => {
                    return {
                        x: index,
                        y: monthlyData.totalPiiCount
                    }
                }));

                // ActiveUsers Monthly
                setActiveUsersMonthly(response.data.monthly.map((monthlyData, index) => {
                    return {
                        x: index,
                        y: monthlyData.activeUsers
                    }
                }));

                // Dual Line data
                setPromptsSentDaily(response.data.daily.map((dailyData, index) => {
                    return {
                        x: index,
                        y: dailyData.totalMessageCount,
                        label: dailyData.label
                    }
                }));
                setDataRedactionsDaily(response.data.daily.map((dailyData, index) => {
                    return {
                        x: index,
                        y: dailyData.totalPiiCount,
                        label: dailyData.label
                    }
                }));

                // Pie chart data
                response.data.topRedactedSensitiveData.forEach((data, index) => {
                    data["colour"] = ListOfColors[index];
                    return data;
                });

                setStats(response.data);
                updateLoading(false);
                console.log(response.data, { stats })

            } else {
                Notification.createNotification({
                    type: "Error",
                    subHeading: "Failed to get Overview data"
                });
            }
        }
        if (!stats) init();
    });

    if (isLoading || !stats) {
        return <Loader />;
    }

    return (
        <OutsideContainer>
            <SmallContainerWrapper>
                <SmallContainer hideLeftBorder>
                    <SmallContainerTitle>Active Users</SmallContainerTitle>
                    <SmallContent>
                        <SmallContentLeft>
                            {!isLoading && <>
                                <Count>{stats.bimonthly.activeUsers}</Count>
                                <Compare>
                                    <PercentCompareUp isUp={stats.bimonthly.activeUsersPercent >= 0}>
                                        {stats.bimonthly.activeUsersPercent >= 0 ? <ArrowUp></ArrowUp> : <ArrowDown></ArrowDown>}
                                        {Math.abs(stats.bimonthly.activeUsersPercent)}%
                                    </PercentCompareUp>
                                    <Compare2>vs last month</Compare2>
                                </Compare>
                            </>}
                        </SmallContentLeft>

                        <SmallContentRight>
                            {!isLoading && <LineChart
                                data={activeUsersMonthly}
                                width={160}
                                height={120}
                                margin={{ top: 0, right: 0, bottom: 0, left: 10 }}
                                showLabel={false}
                                strokeColor={stats.bimonthly.activeUsersPercent >= 0 ? Colors.green.p70 : Colors.red.p5}
                            />}
                        </SmallContentRight>
                    </SmallContent>
                </SmallContainer>

                <SmallContainer>
                    <SmallContainerTitle>Prompts Sent</SmallContainerTitle>
                    <SmallContent>
                        <SmallContentLeft>
                            {!isLoading && <>
                                <Count>{stats.bimonthly.promptSent}</Count>
                                <Compare>
                                    <PercentCompareUp isUp={stats.bimonthly.promptSentPercent >= 0}>
                                        {stats.bimonthly.promptSentPercent >= 0 ? <ArrowUp></ArrowUp> : <ArrowDown></ArrowDown>}
                                        {Math.abs(stats.bimonthly.promptSentPercent)}%
                                    </PercentCompareUp>
                                    <Compare2>vs last month</Compare2>
                                </Compare>
                            </>}
                        </SmallContentLeft>

                        <SmallContentRight>
                            {!isLoading && <LineChart
                                data={promptsSentMonthly}
                                width={160}
                                height={120}
                                margin={{ top: 0, right: 0, bottom: 0, left: 10 }}
                                showLabel={false}
                                strokeColor={stats.bimonthly.promptSentPercent >= 0 ? Colors.green.p70 : Colors.red.p5}
                            />}
                        </SmallContentRight>
                    </SmallContent>
                </SmallContainer>

                <SmallContainer>
                    <SmallContainerTitle>Data Redactions</SmallContainerTitle>
                    <SmallContent>
                        <SmallContentLeft>
                            {!isLoading && <>
                                <Count>{stats.bimonthly.piiCount}</Count>
                                <Compare>
                                    <PercentCompareUp isUp={stats.bimonthly.piiCountPercent >= 0}>
                                        {stats.bimonthly.piiCountPercent >= 0 ? <ArrowUp></ArrowUp> : <ArrowDown></ArrowDown>}
                                        {Math.abs(stats.bimonthly.piiCountPercent)}%
                                    </PercentCompareUp>
                                    <Compare2>vs last month</Compare2>
                                </Compare>
                            </>}
                        </SmallContentLeft>
                        <SmallContentRight>
                            {!isLoading && <LineChart
                                data={dataRedactionsMonthly}
                                width={160}
                                height={120}
                                margin={{ top: 0, right: 0, bottom: 0, left: 10 }}
                                showLabel={false}
                                strokeColor={stats.bimonthly.piiCountPercent >= 0 ? Colors.green.p70 : Colors.red.p5}
                            />}
                        </SmallContentRight>
                    </SmallContent>
                </SmallContainer>
            </SmallContainerWrapper>


            <MediumContainerWrapper>
                <MediumContainer>
                    <MediumContainerTitle>Prompts Sent vs Data Redactions</MediumContainerTitle>
                    {!isLoading && <LineChart data={promptsSentDaily} data2={dataRedactionsDaily} showLabel={true} />}

                </MediumContainer>
                <MediumContainer>
                    <MediumContainerTitle>Top Redacted Sensitive Data</MediumContainerTitle>
                    {!isLoading && <PieChartContainer>
                        <PieChart data={stats.topRedactedSensitiveData} innerRadius={50} outerRadius={100} />
                        <PieChartTable data={stats.topRedactedSensitiveData} />
                    </PieChartContainer>}
                </MediumContainer>
            </MediumContainerWrapper>


            <LargeContainerWrapper>
                <LargeContainer>
                    <LargeContainerTitle>
                        Usage across User Groups
                    </LargeContainerTitle>
                    {
                        !isLoading && <Usage data={stats.UsageAcrossUserGroups}></Usage>
                    }

                </LargeContainer>
            </LargeContainerWrapper>
        </OutsideContainer>
    );
};
