"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Documents from '@/components/crm/Documents/Documents'
import { PolicyIcon } from 'hugeicons-react'
import MilstonesDone from './Milestones/MilstonesDone'
import Notes from '@/components/crm/Notes/Notes'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import ApplicationOverview from './ApplicationOverview'


const DocsSVG = ({ active }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            className="injected-svg"
            role="img"
            color={active ? 'currentColor' : '#9b9b9b'}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.7237 22.5402C16.2322 22.3295 16.6227 21.9382 17.1163 21.4438L17.1163 21.4438L19.944 18.616C20.4385 18.1225 20.8298 17.7319 21.0404 17.2234C21.251 16.715 21.2505 16.1621 21.2498 15.4635L21.2498 10.9446C21.2498 9.57702 21.2498 8.4747 21.1332 7.60773C21.0122 6.70762 20.7533 5.94975 20.1514 5.34783C19.5495 4.74592 18.7916 4.48702 17.8915 4.36601C17.0245 4.24945 15.9222 4.24946 14.5546 4.24948L12.4449 4.24948C11.0773 4.24946 9.97498 4.24945 9.10801 4.36601C8.2079 4.48702 7.45003 4.74592 6.84811 5.34783C6.24619 5.94975 5.9873 6.70762 5.86628 7.60773C5.74972 8.47469 5.74974 9.57702 5.74976 10.9446L5.74976 10.9446L5.74976 16.0544L5.74976 16.0544C5.74974 17.422 5.74972 18.5243 5.86628 19.3912C5.9873 20.2913 6.24619 21.0492 6.84811 21.6511C7.45002 22.2531 8.2079 22.5119 9.10801 22.633C9.97497 22.7495 12.5962 22.7496 13.9638 22.7496C14.6624 22.7502 15.2153 22.7508 15.7237 22.5402ZM16.1416 20.2971C15.5202 20.9184 15.3479 21.072 15.1503 21.1538C14.9874 21.2213 14.8023 21.2422 14.2507 21.2475L14.2507 20.499L14.2507 20.499L14.2507 20.499C14.2507 19.6005 14.2507 18.7993 14.3306 18.2045C14.415 17.5767 14.6007 17.0099 15.0562 16.5544C15.5116 16.099 16.0784 15.9133 16.7062 15.8289C17.301 15.7489 18.0502 15.749 18.9487 15.749L19.7488 15.749C19.7435 16.3009 19.7227 16.486 19.6552 16.6489C19.5733 16.8466 19.4197 17.0189 18.7984 17.6402L16.1416 20.2971ZM10.0027 12.7494C9.58845 12.7494 9.25266 12.4136 9.25266 11.9994C9.25266 11.5852 9.58845 11.2494 10.0027 11.2494L14.0027 11.2494C14.4169 11.2494 14.7527 11.5852 14.7527 11.9994C14.7527 12.4136 14.4169 12.7494 14.0027 12.7494L10.0027 12.7494ZM10.0027 8.74941C9.58845 8.74941 9.25266 8.41362 9.25266 7.99941C9.25266 7.58519 9.58845 7.24941 10.0027 7.24941L17.0027 7.24941C17.4169 7.24941 17.7527 7.58519 17.7527 7.99941C17.7527 8.41362 17.4169 8.74941 17.0027 8.74941L10.0027 8.74941Z"
                fill="currentColor"
            />
            <path
                d="M4.58919 19.2277C3.48816 18.5743 2.75012 17.3735 2.75012 16.0004L2.75012 7.94549C2.7501 6.57792 2.75009 5.47558 2.86665 4.60862C2.98766 3.70851 3.24656 2.95063 3.84847 2.34871C4.45039 1.7468 5.20827 1.48791 6.10837 1.36689C6.97534 1.25033 8.07766 1.25035 9.44526 1.25037L14.5005 1.25037C15.8734 1.25037 17.074 1.9882 17.7274 3.08895C16.8409 2.99981 15.7879 2.99987 14.6309 2.99993L12.3694 2.99993C11.0648 2.99986 9.89239 2.9998 8.94182 3.1276C7.9036 3.26719 6.83771 3.59129 5.9646 4.46439C5.09149 5.3375 4.76738 6.40339 4.6278 7.44162C4.5 8.39219 4.50006 9.56458 4.50013 10.8691L4.50013 16.1307C4.50007 17.2879 4.50001 18.341 4.58919 19.2277Z"
                fill="currentColor"
            />
        </svg>

    )
}

const NotesSVG = ({ active }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            className="injected-svg"
            data-src="https://cdn.hugeicons.com/icons/message-02-solid-rounded.svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            role="img"
            color={active ? 'currentColor' : '#9b9b9b'}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.77965 1.82273C11.2369 1.72586 12.7601 1.72566 14.2204 1.82273C18.787 2.12629 22.4103 5.81258 22.7082 10.4224C22.7639 11.2848 22.7639 12.1768 22.7082 13.0392C22.4103 17.649 18.787 21.3353 14.2204 21.6389C12.7601 21.7359 11.2369 21.7357 9.77965 21.6389C9.21472 21.6013 8.59978 21.4677 8.05839 21.2448C7.8203 21.1467 7.65868 21.0804 7.54041 21.037C7.45909 21.0929 7.35108 21.1723 7.1938 21.2883C6.40136 21.8726 5.40092 22.2825 3.98117 22.248L3.93544 22.2469C3.66155 22.2403 3.36961 22.2334 3.13152 22.1873C2.84475 22.1318 2.48996 21.9931 2.26791 21.6145C2.02623 21.2025 2.12313 20.7858 2.21688 20.5234C2.30536 20.2757 2.45874 19.9852 2.61542 19.6885L2.6369 19.6478C3.10323 18.7641 3.23314 18.0419 2.98381 17.5604C2.15148 16.304 1.40272 14.7556 1.2918 13.0392C1.23607 12.1768 1.23607 11.2848 1.2918 10.4224C1.58972 5.81258 5.213 2.12629 9.77965 1.82273ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H8.00897C8.56126 13 9.00897 12.5523 9.00897 12C9.00897 11.4477 8.56126 11 8.00897 11H8ZM11.9955 11C11.4432 11 10.9955 11.4477 10.9955 12C10.9955 12.5523 11.4432 13 11.9955 13H12.0045C12.5568 13 13.0045 12.5523 13.0045 12C13.0045 11.4477 12.5568 11 12.0045 11H11.9955ZM15.991 11C15.4387 11 14.991 11.4477 14.991 12C14.991 12.5523 15.4387 13 15.991 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H15.991Z"
                fill="currentColor"
            />
        </svg>

    )
}

const MilestonesSVG = ({ active }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            className="injected-svg"
            data-src="https://cdn.hugeicons.com/icons/laptop-check-solid-rounded.svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            role="img"
            color={active ? 'currentColor' : '#9b9b9b'}
        >
            <path
                d="M21.8177 17.25H2.18283L0.910363 19.3935C0.902701 19.4065 0.895427 19.4196 0.888553 19.4329C0.443179 20.2975 1.10916 21.25 2.01603 21.25H21.9844C22.8913 21.25 23.5573 20.2975 23.1119 19.4329C23.1051 19.4196 23.0978 19.4065 23.0901 19.3935L21.8177 17.25Z"
                fill="currentColor"
            />
            <path
                d="M15.5538 2.75C16.6865 2.74998 17.6121 2.75041 18.3429 2.84863C19.1068 2.95134 19.7693 3.17346 20.298 3.70215C20.8267 4.23084 21.0488 4.89328 21.1515 5.65723C21.2497 6.38803 21.2501 7.31363 21.2501 8.44629V15.75H2.75012V8.44629C2.7501 7.31362 2.75053 6.38804 2.84876 5.65723C2.95147 4.89328 3.17358 4.23084 3.70227 3.70215C4.23096 3.17346 4.8934 2.95134 5.65735 2.84863C6.38815 2.75041 7.31375 2.74998 8.44641 2.75H15.5538ZM16.4532 6.9502C16.2874 6.4234 15.7261 6.13103 15.1993 6.29688C13.8699 6.71555 12.5908 7.89568 11.7267 8.81641C11.4702 9.08966 11.2365 9.35534 11.0333 9.5957C10.9025 9.4579 10.7746 9.33846 10.6554 9.23731C10.4672 9.07765 10.1918 8.86963 9.92297 8.74414C9.4225 8.51059 8.82743 8.72707 8.59387 9.22754C8.36261 9.72318 8.57241 10.3117 9.06262 10.5498C9.06729 10.5528 9.25634 10.6736 9.36145 10.7627C9.57326 10.9424 9.86359 11.2472 10.1183 11.7227C10.2815 12.0273 10.5908 12.2258 10.9357 12.248C11.2805 12.2702 11.6126 12.1121 11.8136 11.8311C11.8781 11.745 12.0669 11.494 12.1886 11.3408C12.4328 11.0333 12.7782 10.6177 13.1847 10.1846C14.041 9.27212 15.0119 8.45227 15.7999 8.2041C16.3267 8.03826 16.6191 7.47698 16.4532 6.9502Z"
                fill="currentColor"
            />
        </svg>

    )
}



const ApplicationTabs = ({ application, env }) => {

    const { applySearchQueries, CustomSearchParams } = useSearchQuery()

    const tabStyle = 'text-xs bg-gray-200 h-8 data-[state=active]:bg-white border data-[state=active]:border-primary data-[state=active]:text-primary cursor-pointer data-[state=active]:shadow-none tracking-tight'
    const [activeTab, setActiveTab] = useState(CustomSearchParams.get('tab') || 'overview')

    return (
        <Tabs
            className="h-full flex flex-col"
            defaultValue={activeTab}
            onValueChange={(value) => {
                setActiveTab(value)
                applySearchQueries([{ name: 'tab', value: value }])
            }}
        >

            <div className='flex mb-3 px-5 shadow-[0px_10px_10px_10px)] shadow-white z-10 bg-white'>
                <TabsList className="border-0 bg-white gap-1 p-0">

                    <TabsTrigger className={tabStyle} value="overview">
                        {/* <div><DocsSVG active={activeTab === 'overview'} /></div> */}
                        <span>Overview</span>
                    </TabsTrigger>

                    <TabsTrigger className={tabStyle} value="documents">
                        <div><DocsSVG active={activeTab === 'documents'} /></div>
                        <span className='ml-1'>Documents</span>
                    </TabsTrigger>

                    <TabsTrigger className={tabStyle} value="notes">
                        <div><NotesSVG active={activeTab === 'notes'} /></div>
                        <span className='ml-1'>Notes</span>
                    </TabsTrigger>

                    <TabsTrigger className={tabStyle} value="milestones">
                        <div><MilestonesSVG active={activeTab === 'milestones'} /></div>
                        <span className='ml-1'>Milestones</span>
                    </TabsTrigger>

                </TabsList>
            </div>

            <div className='h-full flex-1 overflow-auto px-5 pb-6'>


                <TabsContent value="overview">
                    <div className='overflow-auto'>
                        <ApplicationOverview application={application} />
                    </div>
                </TabsContent>


                <TabsContent value="documents">
                    <div className='overflow-auto'>
                        <Documents filterEmptyFolders={false} downloadAll={true} actions={false} contact_id={application?.student?.contact_id} />
                    </div>
                </TabsContent>

                <TabsContent value="notes">
                    <div className=''>
                        <Notes application={application} />
                    </div>
                </TabsContent>

                <TabsContent value="milestones">
                    <div className=''>
                        <MilstonesDone status={application?.status} application={application} env={env} />
                    </div>
                </TabsContent>

            </div>

        </Tabs>
    )
}

export default ApplicationTabs
