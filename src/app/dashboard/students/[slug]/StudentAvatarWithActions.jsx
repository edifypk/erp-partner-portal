"use client";

import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import AvatarPicker from "@/components/AvatarPicker";
import { Camera01Icon } from "hugeicons-react";





const StudentAvatarWithActions = ({ student: enquiry, editMode, setEditMode, enquiryType = "study_abroad" }) => {

  const [createLangStudentModalOpen, setCreateLangStudentModalOpen] = useState(false)



  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false)
  var router = useRouter()



  const deleteEnquiry = async () => {
    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/${enquiryType === "study_abroad" ? "enquiries" : "lang-coaching/enquiries"}/${enquiry?.id}`, {
          withCredentials: true
        });
        resolve();
        router.push(enquiryType === "study_abroad" ? "/dashboard/crm/enquiries" : "/dashboard/lang-crm/enquiries");
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(
      submitPromise,
      {
        loading: "Deleting enquiry...",
        success: () => "Enquiry deleted successfully",
        error: (err) => err?.response?.data?.message || "Failed to delete enquiry",
      }
    );
  };

  const updateEnquiryPhoto = async (fileID) => {
    const submitPromise = new Promise(async (resolve, reject) => {
      try {

        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/students/${enquiry?.contact_id}`, {
          contact: {
            photo_id: fileID
          }
        }, { withCredentials: true })

        resolve()
        router.refresh()

      } catch (error) {
        reject(error); // Reject promise to show error toast
      }
    });

    toast.promise(
      submitPromise,
      {
        loading: "Updating...",
        success: () => `Updated successfully`, // Customize success message
        error: (err) => err?.response?.data?.message || err.message, // Display error from the backend or default message
      }
    );
  };






  return (
    <div className="bg-linear-to-br from-primary/15 to-transparent rounded-3xl border p-3">






      <div className="flex justify-between items-center relative">
        <div></div>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0 ">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-[10px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem className="tracking-tight font-medium" onClick={() => { setDropdownOpen(false); setEditMode(!editMode); }}>
              <img className="w-4" src={`/images/actions/edit.svg`} alt="" /> {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                if (window.confirm('Are you sure you want to delete this enquiry?')) {
                  deleteEnquiry();
                }
              }}
              className="tracking-tight font-medium"
            >
              <img className="w-4" src="/images/actions/trash.svg" alt="" />
              Delete Enquiry
            </DropdownMenuItem>

            <DropdownMenuItem
              className="tracking-tight font-medium"
              onClick={() => {
                setDropdownOpen(false);
                setCreateStudentModalOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 28 28"
                fill="none"
                className="pl-[2px] scale-110 w-4 flex justify-start items-center"
                role="img"
                color="#2463eb"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.0004 8.73812C19.5527 8.73812 20.0004 9.18584 20.0004 9.73812V14.0579C20.1799 15.1626 20.8053 17.4739 22.6845 19.2365C23.0298 19.5604 23.1007 20.0819 22.8544 20.4862C22.377 21.2698 21.4031 22.1929 19.9761 22.6272C18.5515 23.0607 16.7634 22.9812 14.6896 21.9402L14.4113 22.1278C12.9334 23.124 11.067 23.124 9.58906 22.1278L9.31222 21.9412C7.23774 22.9829 5.44908 23.0626 4.02402 22.6289C2.59701 22.1947 1.62315 21.2716 1.14576 20.4879C0.899476 20.0837 0.970376 19.5621 1.31563 19.2383C3.19485 17.4757 3.82029 15.1643 3.99976 14.0596V9.81625C3.99976 9.26396 4.44747 8.81625 4.99976 8.81625C5.55204 8.81625 5.99976 9.26396 5.99976 9.81625V14.1378C5.99976 14.1882 5.99594 14.2385 5.98835 14.2883C5.81219 15.445 5.20808 17.9032 3.34446 20.0158C3.65162 20.2875 4.0729 20.5532 4.60626 20.7156C5.33124 20.9362 6.32601 20.9841 7.60652 20.508C6.89379 19.5955 6.5002 18.4283 6.5002 17.2237V15.875C6.5002 15.3227 6.94791 14.875 7.5002 14.875C8.05248 14.875 8.5002 15.3227 8.5002 15.875V17.2237C8.5002 18.3459 9.02538 19.3358 9.80697 19.8627L10.707 20.4694C11.5092 21.0102 12.4912 21.0102 13.2934 20.4694L14.1934 19.8627C14.975 19.3358 15.5002 18.3459 15.5002 17.2237V15.875C15.5002 15.3227 15.9479 14.875 16.5002 14.875C17.0525 14.875 17.5002 15.3227 17.5002 15.875V17.2237C17.5002 18.4278 17.107 19.5944 16.3949 20.5067C17.6748 20.9823 18.6692 20.9343 19.3939 20.7138C19.9273 20.5515 20.3485 20.2857 20.6557 20.014C18.7921 17.9014 18.188 15.4432 18.0118 14.2866C18.0042 14.2367 18.0004 14.1864 18.0004 14.136V9.73812C18.0004 9.18584 18.4481 8.73812 19.0004 8.73812Z"
                  fill="#2463eb"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1.12496C11.4296 1.12496 10.9077 1.27285 10.3442 1.51552C9.80194 1.74907 9.17337 2.0926 8.39642 2.51723L3.58595 5.1462L3.58595 5.1462C2.97171 5.48183 2.4352 5.77498 2.05703 6.0643C1.65504 6.37185 1.27301 6.79383 1.25095 7.42144C1.22898 8.04683 1.57806 8.49607 1.95502 8.83437C2.31092 9.15378 2.82449 9.49053 3.41405 9.87711L3.99997 10.1905V13.375C3.99997 13.6139 4.11746 13.8385 4.31633 13.9798C4.5152 14.121 4.77165 14.1621 5.00686 14.0903C6.99328 13.4839 9.3984 13.125 12 13.125C14.6015 13.125 17.0067 13.4839 18.9931 14.0903C19.2283 14.1621 19.4847 14.121 19.6836 13.9798C19.8825 13.8385 20 13.6139 20 13.375V10.1906L20.586 9.8771C21.1755 9.49052 21.6891 9.15377 22.045 8.83437C22.4219 8.49607 22.771 8.04683 22.749 7.42144C22.727 6.79383 22.3449 6.37185 21.943 6.0643C21.5648 5.77498 21.0283 5.48183 20.414 5.1462L20.414 5.14619L15.6036 2.51724C14.8266 2.09261 14.1981 1.74907 13.6558 1.51552C13.0923 1.27285 12.5703 1.12496 12 1.12496Z"
                  fill="#2463eb"
                />
              </svg>
              Create Student
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>





      {/* student & Counsellor */}
      <div className=''>

        <div className="w-20 mx-auto relative group h-20 mb-2 border border-gray-200 bg-linear-to-br from-blue-300 to-white overflow-hidden flex-col rounded-full  flex items-center justify-center">

          <div className="w-full h-full">
            <img src={enquiry?.contact?.photo_url || "/images/placeholder/male.png"} alt="" className="w-full h-full object-cover rounded-full" />
          </div>

          <AvatarPicker
            onSave={async (file, setIsSaved) => {
              await updateEnquiryPhoto(file?.id)
              setIsSaved()
            }}
            path={`uploads/lead-photos`}
          >
            <div className="flex absolute bg-white/60 backdrop-blur-md py-1 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer w-full flex-col gap-2 items-center justify-center">
              <Camera01Icon size={20} />
            </div>
          </AvatarPicker>

        </div>

        <div className="text-center">
          <div className="translate-y-[2px] font-semibold">{enquiry?.contact?.name}</div>
          <div className='text-xs font-semibold -translate-y-px'>{enquiry?.contact_id}</div>
        </div>

      </div>




    </div>
  );
};

export default StudentAvatarWithActions;



