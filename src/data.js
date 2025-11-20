import { CursorPointer01Icon, FileImportIcon, Link04Icon, Tap06Icon, TypeCursorIcon } from "hugeicons-react"

export const applicationRequestsStatuses = [
    {
        action: "Pending",
        name: "Pending",
        slug: "pending",
        color: "red"
    },
    
    // {
    //     action:"Approve",
    //     name:"Approved",
    //     slug:"approved",
    //     color:"green"
    // },
    {
        action: "Reject",
        name: "Rejected",
        slug: "rejected",
        color: "red"
    },
    {
        action: "Cancel",
        name: "Cancelled",
        slug: "cancelled",
        color: "gray"
    }
]


const fileExtensionsImages = [
    {
        img: "/images/file-types/img.svg",
        extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg", "heic", "heif"]
    },
    {
        img: "/images/file-types/video.svg",
        extensions: ["mp4", "mov", "avi", "mkv", "wmv", "flv", "webm", "m4v", "m4a", "m4b", "m4p", "m4v", "m4a", "m4b", "m4p"]
    },
    {
        img: "/images/file-types/audio.svg",
        extensions: ["mp3", "wav", "ogg", "m4a", "m4b", "m4p", "m4v", "m4a", "m4b", "m4p"]
    },
    {
        img: "/images/file-types/pdf.svg",
        extensions: ["pdf"]
    },
    {
        img: "/images/file-types/word.svg",
        extensions: ["doc", "docx"]
    },
    {
        img: "/images/file-types/excel.svg",
        extensions: ["xls", "xlsx", "csv"]
    },
    {
        img: "/images/file-types/ppt.svg",
        extensions: ["ppt", "pptx"]
    },
    {
        img: "/images/file-types/ai.svg",
        extensions: ["ai"]
    },
    {
        img: "/images/file-types/psd.svg",
        extensions: ["psd"]
    },
    {
        img: "/images/file-types/txt.svg",
        extensions: ["txt"]
    },
    {
        img: "/images/file-types/folder.svg",
        extensions: ["folder"]
    },
    {
        img: "/images/file-types/zip.svg",
        extensions: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"]
    }
]

export const getFileExtensionImage = (extension) => {
    return fileExtensionsImages.find(f => f.extensions.includes(extension))?.img || "/images/file-types/img.svg"
}



export const appsList = [
    {
        key: 'crm',
        name: 'CRM App',
        description: 'Study Abroad Consultancy',
        icon: '/images/module-logos/crm.svg',
        link: '/crm',
        gradient: 'bg-gradient-to-b from-blue-700 to-blue-500'
    },
    {
        key: 'lang-crm',
        name: 'CRM App',
        description: 'Language Test Preparation',
        icon: '/images/module-logos/lang-crm.svg',
        link: '/lang-crm',
        gradient: 'bg-gradient-to-b from-indigo-700 to-indigo-500'
    },
    // {
    //     name: 'HR',
    //     icon: '/images/module-logos/hr.svg',
    //     link: '/hr',
    //     gradient: 'bg-gradient-to-b from-indigo-700 to-indigo-500'
    // },
    // {
    //     name: 'Agreements',
    //     key: 'agreements',
    //     icon: '/images/module-logos/agreements.svg',
    //     link: '/agreements',
    //     gradient: 'bg-gradient-to-b from-teal-700 to-teal-500'
    // },
    {
        key: 'settings',
        name: 'Settings',
        description: 'Edify ERP',
        icon: '/images/module-logos/settings.svg',
        link: '/settings',
        gradient: 'bg-gradient-to-b from-cyan-700 to-cyan-500'
    },
    {
        key: 'accounting',
        name: 'Accounting',
        description: 'Edify ERP',
        icon: '/images/module-logos/accounting.svg',
        link: '/accounting',
        gradient: 'bg-gradient-to-b from-green-700 to-green-500'
    },
    {
        key: 'email-marketing',
        name: 'Email Marketing',
        description: 'Edify ERP',
        icon: '/images/module-logos/email-marketing.svg',
        link: '/email-marketing',
        gradient: 'bg-gradient-to-b from-indigo-700 to-indigo-500'
    },
]


export const courseEnrollmentStatuses = [
    {
        name: "Active",
        slug: "active",
        color: "#15803d"
    },
    {
        name: "Total",
        slug: "total",
        color: "#4d7c0f"
    },
    {
        name: "Completed",
        slug: "completed",
        color: "#047857"
    },
    {
        name: "Freezed",
        slug: "freezed",
        color: "#334155"
    },
    {
        name: "Dropped",
        slug: "dropped",
        color: "#b45309"
    },
    {
        name: "Refunded",
        slug: "refunded",
        color: "#b91c1c"
    },
]



export const applicationChecks = [
    {
        label: "Submitted to Institute",
        key: "is_submitted_to_institute"
    },
    {
        label: "Unconditional Received",
        key: "is_unconditional_received"
    },
    {
        label: "Tuition Fee Paid",
        key: "is_fee_paid"
    },
    {
        label: "Sponsorship Letter Received",
        key: "is_spon_letter_received"
    },
    {
        label: "Visa Granted",
        key: "is_visa_granted"
    },
    {
        label: "Enrolled Confirmed",
        key: "is_enrolled"
    }
]


export const emailContactsStatuses = [
    {
        name: "Active",
        slug: "active",
        color: "green"
    },
    {
        name: "Unsubscribed",
        slug: "unsubscribed",
        color: "red"
    },
    {
        name: "Bounced",
        slug: "bounced",
        color: "red"
    }
]


export const emailContactsSources = [
    {
        name: "Imported",
        slug: "imported",
        icon: FileImportIcon,
        color: "blue"
    },
    {
        name: "Manual",
        slug: "manual",
        icon:CursorPointer01Icon,
        color: "green"
    },
    {
        name: "API",
        slug: "api",
        icon:Link04Icon,
        color: "purple"
    },
    {
        name: "Form",
        icon:TypeCursorIcon,
        slug: "form",
        color: "orange"
    }
]


export const emailCampaignStatuses = [
    {
        name: "Draft",
        slug: "draft",
        color: "gray"
    },
    {
        name: "Sending",
        slug: "sending",
        color: "orange"
    },
    {
        name: "Scheduled",
        slug: "scheduled",
        color: "blue"
    },
    {
        name: "Sent",
        slug: "sent",
        color: "green"
    },
    {
        name: "Failed",
        slug: "failed",
        color: "red"
    }
]