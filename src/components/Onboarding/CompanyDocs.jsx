"use client";

import React, { useState, useEffect } from "react";
import FilesUploadWidget from "@/components/FilesUploadWidget";
import { useAuth } from "@/context/AuthContextProvider";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FileValidationIcon, Tick04Icon } from "hugeicons-react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";

const CompanyDocs = ({ onSubmitSuccess }) => {
    const { user, agentData, fetchAgentData } = useAuth();
    const [companyRegistrationFile, setCompanyRegistrationFile] = useState(null);
    const [idProofFile, setIdProofFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Load existing files when agent data changes
    useEffect(() => {
        if (agentData) {
            if (agentData.company_registration_file_id) {
                setCompanyRegistrationFile({
                    id: agentData.company_registration_file_id,
                    name: agentData.company_registration_file?.original_name || "Company Registration Document",
                    path: agentData.company_registration_file?.path,
                });
            }

            if (agentData.id_proof_file_id) {
                setIdProofFile({
                    id: agentData.id_proof_file_id,
                    name: agentData.id_proof_file?.original_name || "ID Proof Document",
                    path: agentData.id_proof_file?.path,
                });
            }
        }
    }, [agentData]);

    // File upload handlers
    const handleCompanyRegistrationUpload = async (file) => {
        setCompanyRegistrationFile(file);
        if (file?.id) {
            await saveDocument(file.id, idProofFile?.id);
        }
    };

    const handleIdProofUpload = async (file) => {
        setIdProofFile(file);
        if (file?.id) {
            await saveDocument(companyRegistrationFile?.id, file.id);
        }
    };

    // Save document to backend
    const saveDocument = async (companyRegId, idProofId) => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                { 
                    company_registration_file_id: companyRegId, 
                    id_proof_file_id: idProofId 
                },
                { withCredentials: true }
            );
            fetchAgentData(); // Refresh agent data
            toast.success("Document saved successfully!");
        } catch (error) {
            toast.error("Failed to save document");
        }
    };

    // File removal handlers
    const handleRemoveCompanyRegistration = () => {
        setCompanyRegistrationFile(null);
        toast.success("Company registration document removed");
    };

    const handleRemoveIdProof = () => {
        setIdProofFile(null);
        toast.success("ID proof document removed");
    };

    // View document handler
    const handleViewDocument = async (file) => {
        if (!file?.path) {
            toast.error("Document path not available");
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`,
                {
                    params: { key: file.path },
                    withCredentials: true
                }
            );
            const presignedUrl = response.data.data.signedUrl;
            if (presignedUrl) {
                window.open(presignedUrl, '_blank');
            }
        } catch (error) {
            console.error("Error getting presigned URL:", error);
            toast.error("Failed to generate document URL");
        }
    };

    // Submit for review handler
    const handleSubmitForReview = async () => {
        const status = agentData?.onboarding_status;

        // If already approved or pending contract, just go to next step
        if (status === 'pending_contract' || status === 'approved') {
            onSubmitSuccess?.();
            return;
        }

        // If under review, show info message
        if (status === 'under_review') {
            toast.info("Your application is already under review");
            return;
        }

        // Validate documents are uploaded
        if (!companyRegistrationFile || !idProofFile) {
            toast.error("Please upload both company registration and ID proof documents");
            return;
        }

        try {
            setSubmitting(true);
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}/documents`,
                {
                    company_registration_file_id: companyRegistrationFile.id,
                    id_proof_file_id: idProofFile.id,
                    onboarding_status: 'under_review',
                },
                { withCredentials: true }
            );
            fetchAgentData(); // Refresh agent data
            toast.success("Submitted for review successfully!");
        } catch (error) {
            toast.error("Failed to submit for review");
        } finally {
            setSubmitting(false);
        }
    };

    // Computed values for cleaner JSX
    const status = agentData?.onboarding_status;
    const isInProgress = status === 'in_progress' || !status;
    const isUnderReview = status === 'under_review';
    const isReadyForContract = status === 'pending_contract' || status === 'approved';
    const canUploadFiles = isInProgress;
    const bothFilesUploaded = companyRegistrationFile && idProofFile;

    // Button state
    const getButtonText = () => {
        if (submitting) return "Submitting...";
        if (isUnderReview) return "Under Review";
        if (isReadyForContract) return "Next";
        return "Submit For Review";
    };

    const isButtonDisabled = submitting || isUnderReview || (!isReadyForContract && !bothFilesUploaded);

    if (!agentData && !user?.subagent_team_member?.agent?.id) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
                <span className="ml-2 text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto pt-6">
            <div className="grid gap-6">
                {/* Company Registration File */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold">Company Registration Document</h3>
                        <p className="text-xs text-gray-500">Upload your company registration certificate or incorporation document</p>
                    </div>

                    {companyRegistrationFile ? (
                        <div className="border border-dotted border-primary/20 rounded-lg p-4 relative bg-white">
                            {canUploadFiles && (
                                <button
                                    onClick={handleRemoveCompanyRegistration}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                    title="Remove document"
                                >
                                    <img src="/images/actions/trash.svg" alt="" />
                                </button>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Tick04Icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-primary tracking-tight">
                                        {companyRegistrationFile.name}
                                    </div>
                                    <div className="text-xs text-primary/60">
                                        {isUnderReview ? "Submitted for review" : "Uploaded successfully"}
                                    </div>
                                </div>
                                {companyRegistrationFile.path && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDocument(companyRegistrationFile)}
                                        className="text-xs tracking-tight"
                                    >
                                        <FileValidationIcon />
                                        View Document
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <FilesUploadWidget
                            multipleFiles={false}
                            onUploadSuccess={handleCompanyRegistrationUpload}
                            path={`sub-agents/${user?.subagent_team_member?.agent?.id}/company-registration`}
                            isModal={false}
                            disabled={!canUploadFiles}
                        >
                            <Button variant="outline" className="w-full" disabled={!canUploadFiles}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload Company Registration
                            </Button>
                        </FilesUploadWidget>
                    )}
                </div>

                {/* ID Proof File */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold">ID Proof Document</h3>
                        <p className="text-xs text-gray-500">Upload your government-issued ID or passport</p>
                    </div>

                    {idProofFile ? (
                        <div className="border border-dotted border-primary/20 rounded-lg p-4 relative bg-white">
                            {canUploadFiles && (
                                <button
                                    onClick={handleRemoveIdProof}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                    title="Remove document"
                                >
                                    <img src="/images/actions/trash.svg" alt="" />
                                </button>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Tick04Icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-primary tracking-tight">
                                        {idProofFile.name}
                                    </div>
                                    <div className="text-xs text-primary/60">
                                        {isUnderReview ? "Submitted for review" : "Uploaded successfully"}
                                    </div>
                                </div>
                                {idProofFile.path && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDocument(idProofFile)}
                                        className="text-xs tracking-tight"
                                    >
                                        <FileValidationIcon />
                                        View Document
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <FilesUploadWidget
                            multipleFiles={false}
                            onUploadSuccess={handleIdProofUpload}
                            path={`sub-agents/${user?.subagent_team_member?.agent?.id}/id-proof`}
                            isModal={false}
                            disabled={!canUploadFiles}
                        >
                            <Button variant="outline" className="w-full" disabled={!canUploadFiles}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload ID Proof
                            </Button>
                        </FilesUploadWidget>
                    )}
                </div>
            </div>

            {/* Submit Button and Status Messages */}
            <div className="flex flex-col items-center pt-4 space-y-3">
                {isUnderReview && (
                    <img className="w-20 h-20" src="/images/no-data.gif" alt="Under Review" />
                )}

                <RippleButton
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={isButtonDisabled}
                    className="min-w-[200px]"
                >
                    {submitting && (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    )}
                    {getButtonText()}
                </RippleButton>

                {isUnderReview && (
                    <div className="text-center">
                        <h2 className="text-sm font-semibold tracking-tight mb-1">
                            Your onboarding process is under review
                        </h2>
                        <p className="text-xs text-gray-700 max-w-md">
                            You'll receive an email notification once approved and will then be able to access the contract.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDocs;
