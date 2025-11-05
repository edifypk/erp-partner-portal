"use client";

import React, { useState, useEffect } from "react";
import FilesUploadWidget from "@/components/FilesUploadWidget";
import { useAuth } from "@/context/AuthContextProvider";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FileValidationIcon, Tick04Icon, Delete01Icon } from "hugeicons-react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CompanyDocs = ({ onSubmitSuccess }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [companyRegistrationFile, setCompanyRegistrationFile] = useState(null);
    const [idProofFile, setIdProofFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // React Query for fetching sub-agent data
    const { data: agentData, isLoading, error } = useQuery({
        queryKey: ['subAgent', user?.subagent_team_member?.agent?.id],
        queryFn: async () => {
            if (!user?.subagent_team_member?.agent?.id) return null;
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                { withCredentials: true }
            );
            return response.data.data;
        },
        enabled: !!user?.subagent_team_member?.agent?.id,
    });

    // Mutation for updating documents
    const updateDocumentsMutation = useMutation({
        mutationFn: async ({ company_registration_file_id, id_proof_file_id }) => {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                {
                    company_registration_file_id,
                    id_proof_file_id,
                },
                { withCredentials: true }
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['subAgent', user?.subagent_team_member?.agent?.id]);
            toast.success("Document saved successfully!");
        },
        onError: (error) => {
            toast.error("Failed to save document");
            console.error("Error saving document:", error);
        },
    });

    // Mutation for submitting for review
    const submitForReviewMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}/documents`,
                {
                    company_registration_file_id: companyRegistrationFile?.id,
                    id_proof_file_id: idProofFile?.id,
                    onboarding_status: 'under_review',
                },
                { withCredentials: true }
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['subAgent', user?.subagent_team_member?.agent?.id]);
            toast.success("Submitted for review successfully!");
            // Don't proceed to next step - user needs to wait for approval
        },
        onError: (error) => {
            toast.error("Failed to submit for review");
            console.error("Error submitting for review:", error);
        },
    });

    // Load existing files when agentData changes
    useEffect(() => {
        if (agentData) {
            // Set existing files if they exist
            if (agentData.company_registration_file_id) {
                const companyFile = {
                    id: agentData.company_registration_file_id,
                    name: agentData.company_registration_file?.original_name || "Company Registration Document",
                    path: agentData.company_registration_file?.path,
                };
                setCompanyRegistrationFile(companyFile);
            }

            if (agentData.id_proof_file_id) {
                const idFile = {
                    id: agentData.id_proof_file_id,
                    name: agentData.id_proof_file?.original_name || "ID Proof Document",
                    path: agentData.id_proof_file?.path,
                };
                setIdProofFile(idFile);
            }
        }
    }, [agentData]);

    // Check if form should be disabled
    const isFormDisabled = agentData?.onboarding_status && agentData.onboarding_status !== 'in_progress';

    const handleCompanyRegistrationUpload = async (file) => {
        console.log("Company registration file uploaded:", file);
        setCompanyRegistrationFile(file);

        // Instantly save the document
        if (file?.id) {
            updateDocumentsMutation.mutate({
                company_registration_file_id: file.id,
                id_proof_file_id: idProofFile?.id || null,
            });
        }
    };

    const handleIdProofUpload = async (file) => {
        console.log("ID proof file uploaded:", file);
        setIdProofFile(file);

        // Instantly save the document
        if (file?.id) {
            updateDocumentsMutation.mutate({
                company_registration_file_id: companyRegistrationFile?.id || null,
                id_proof_file_id: file.id,
            });
        }
    };

    const getPresignedUrl = async (fileKey) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`,
                {
                    params: { key: fileKey },
                    withCredentials: true
                }
            );
            return response.data.data.signedUrl;
        } catch (error) {
            console.error("Error getting presigned URL:", error);
            toast.error("Failed to generate document URL");
            return null;
        }
    };

    const handleViewDocument = async (file) => {
        if (!file?.path) {
            toast.error("Document path not available");
            return;
        }

        const presignedUrl = await getPresignedUrl(file.path);
        if (presignedUrl) {
            window.open(presignedUrl, '_blank');
        }
    };

    const handleRemoveCompanyRegistration = () => {
        setCompanyRegistrationFile(null);
        toast.success("Company registration document removed");
    };

    const handleRemoveIdProof = () => {
        setIdProofFile(null);
        toast.success("ID proof document removed");
    };

    const handleSubmitForReview = async () => {
        if (!user?.subagent_team_member?.agent?.id) {
            toast.error("User not authenticated");
            return;
        }

        // If status is pending_contract, just proceed to next step
        if (agentData?.onboarding_status === 'pending_contract') {
            if (onSubmitSuccess) {
                onSubmitSuccess(agentData);
            }
            return;
        }

        if (!companyRegistrationFile || !idProofFile) {
            toast.error("Please upload both company registration and ID proof documents");
            return;
        }

        // Check if editing is allowed
        if (isFormDisabled) {
            toast.info("Your application is under review. Changes are not allowed at this time.");
            return;
        }

        // Check if already under review
        if (agentData?.onboarding_status === 'under_review') {
            toast.info("Your application is already under review");
            return;
        }

        // Submit for review using the mutation
        submitForReviewMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
                <span className="ml-2 text-gray-600">Loading documents...</span>
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
                            {/* Remove button */}
                            {agentData?.onboarding_status == "in_progress" && <button
                                onClick={handleRemoveCompanyRegistration}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                title="Remove document"
                            >
                                <img src="/images/actions/trash.svg" alt="" />
                            </button>}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Tick04Icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-primary tracking-tight">{companyRegistrationFile.name}</div>
                                    <div className="text-xs text-primary/60">{agentData?.onboarding_status == "under_review" ? "Submitted for review" : "Uploaded successfully"}</div>
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
                            disabled={isFormDisabled}
                        >
                            <Button variant="outline" className="w-full">
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
                            {/* Remove button */}
                            {agentData?.onboarding_status == "in_progress" && <button
                                onClick={handleRemoveIdProof}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                                title="Remove document"
                            >
                                <img src="/images/actions/trash.svg" alt="" />
                            </button>}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Tick04Icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-primary tracking-tight">{idProofFile.name}</div>
                                    <div className="text-xs text-primary/60">{agentData?.onboarding_status == "under_review" ? "Submitted for review" : "Uploaded successfully"}</div>
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
                            disabled={isFormDisabled}
                        >
                            <Button variant="outline" className="w-full">
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

            {/* Submit Button */}
            <div className="flex flex-col items-center pt-4 space-y-2">
                {agentData?.onboarding_status == "under_review" && <img className="w-20 h-20" src="/images/no-data.gif" alt="" />}

                {agentData?.onboarding_status != "under_review" && <RippleButton
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={
                        submitForReviewMutation.isPending ||
                        agentData?.onboarding_status === 'under_review' ||
                        (isFormDisabled && agentData?.onboarding_status !== 'pending_contract') ||
                        (agentData?.onboarding_status !== 'pending_contract' && (!companyRegistrationFile || !idProofFile))
                    }
                >

                    {submitForReviewMutation.isPending ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Submitting...
                        </>
                    ) : agentData?.onboarding_status === 'under_review' ? (
                        "Under Review"
                    ) : agentData?.onboarding_status === 'pending_contract' ? (
                        "Next"
                    ) : (
                        "Submit For Review"
                    )}
                </RippleButton>}

                {agentData?.onboarding_status === 'under_review' && (
                    <div className="text-center">
                    <h2 className="text-sm font-semibold tracking-tight mb-1">Your onboarding Process is Under Review.</h2>
                    <p className="text-xs text-gray-700 text-center max-w-md">
                        You'll receive an email notification once pending_contract and will then be able to access the contract.
                    </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDocs;
