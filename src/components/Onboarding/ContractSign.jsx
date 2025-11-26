import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { RippleButton } from '../ui/shadcn-io/ripple-button';
import { SignatureIcon } from 'hugeicons-react';
import { useAuth } from "@/context/AuthContextProvider";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ContractSign = () => {
    const [contractUrl, setContractUrl] = useState(null);
    const [initiatingSign, setInitiatingSign] = useState(false);
    const { agentData } = useAuth();

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (contractUrl && contractUrl.startsWith('blob:')) {
                URL.revokeObjectURL(contractUrl);
            }
        };
    }, [contractUrl]);

    const onboardingStatus = agentData?.onboarding_status || 'in_progress';

    // Fetch contract attachment ONCE when status becomes pending_contract or approved
    useEffect(() => {
        if (!contractUrl && (onboardingStatus === 'pending_contract' || onboardingStatus === 'approved')) {
            const fetchContractAttachment = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/contract-attachment`,
                        { withCredentials: true }
                    );
                    
                    console.log("Contract attachment response:", response.data);
                    
                    if (response.data.status === 'success') {
                        const attachment = response.data.data;
                        
                        if (attachment.datas) {
                            // Ensure mimeType is set, default to PDF
                            const mimeType = attachment.mimeType || 'application/pdf';
                            // Trim any whitespace from base64 data
                            const base64Data = attachment.datas.trim();
                            
                            // Convert base64 to blob URL for better iframe compatibility
                            try {
                                // Decode base64 to binary
                                const binaryString = atob(base64Data);
                                const bytes = new Uint8Array(binaryString.length);
                                for (let i = 0; i < binaryString.length; i++) {
                                    bytes[i] = binaryString.charCodeAt(i);
                                }
                                
                                // Create blob and URL
                                const blob = new Blob([bytes], { type: mimeType });
                                const blobUrl = URL.createObjectURL(blob);
                                
                                console.log("Setting contract URL (blob), mimeType:", mimeType, "dataLength:", base64Data.length, "blobUrl:", blobUrl);
                                setContractUrl(blobUrl);
                            } catch (error) {
                                console.error("Error creating blob URL:", error);
                                // Fallback to data URL
                                const dataUrl = `data:${mimeType};base64,${base64Data}`;
                                console.log("Using data URL fallback:", dataUrl.substring(0, 50) + "...");
                                setContractUrl(dataUrl);
                            }
                        } else {
                            console.error("No datas field in attachment response:", attachment);
                        }
                    } else {
                        console.error("API returned non-success status:", response.data);
                    }
                } catch (error) {
                    console.error("Error fetching contract attachment:", error);
                    if (error.response) {
                        console.error("Error response:", error.response.data);
                    }
                }
            };

            fetchContractAttachment();
        }
    }, [onboardingStatus, contractUrl]);

    const handleStartSigning = async () => {
        try {
            setInitiatingSign(true);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/initiate-signing`,
                {},
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                const signingUrl = response.data.data.signingUrl;
                window.open(signingUrl, '_blank', 'noopener,noreferrer');
                setInitiatingSign(false);
            }
        } catch (error) {
            console.error("Error initiating signing process:", error);
            alert("Failed to start signing process. Please try again.");
            setInitiatingSign(false);
        }
    };

    if (!agentData) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
                <span className="ml-2 text-gray-600">Loading...</span>
            </div>
        );
    }

    // Show different UI based on onboarding status
    if (onboardingStatus === 'under_review') {
        return (
            <div className="space-y-6 max-w-2xl mx-auto pt-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Under Review</h2>
                    <p className="text-gray-600">Your information is currently being reviewed by our team</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-900 mb-2">What happens next?</h3>
                    <ul className="text-sm text-yellow-800 space-y-2">
                        <li>• Our team will review your business information and documents</li>
                        <li>• This process typically takes 1-2 business days</li>
                        <li>• You'll receive an email notification once the review is complete</li>
                        <li>• Once approved, you'll be able to view and sign the contract</li>
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact our support team for assistance.
                    </p>
                </div>
            </div>
        );
    }

    if (onboardingStatus === 'rejected') {
        return (
            <div className="space-y-6 max-w-2xl mx-auto pt-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Application Rejected</h2>
                    <p className="text-gray-600">Your application requires additional information</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-900 mb-2">Next Steps</h3>
                    <ul className="text-sm text-red-800 space-y-2">
                        <li>• Please review your submitted information and documents</li>
                        <li>• Make necessary corrections or provide additional documentation</li>
                        <li>• Resubmit your application for review</li>
                        <li>• Contact our support team if you have questions</li>
                    </ul>
                </div>

                <div className="text-center">
                    <Button onClick={() => window.location.reload()}>
                        Update Information
                    </Button>
                </div>
            </div>
        );
    }

    if (onboardingStatus === 'in_progress') {
        return (
            <div className="space-y-6 max-w-2xl mx-auto pt-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Complete Your Registration</h2>
                    <p className="text-gray-600">Please complete all required steps before accessing the contract</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Required Steps</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li>• Complete your business information</li>
                        <li>• Upload company registration document</li>
                        <li>• Upload ID proof document</li>
                        <li>• Submit for review</li>
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Please go back and complete the previous steps to continue.
                    </p>
                </div>
            </div>
        );
    }

    // Show contract for pending_contract or approved status
    if (onboardingStatus === 'pending_contract' || onboardingStatus === 'approved') {
        return (
            <div className="space-y-6">
                {onboardingStatus === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <div>
                                <h3 className="font-semibold text-green-900">Contract Signed Successfully!</h3>
                                <p className="text-sm text-green-700">Your partnership has been approved. Welcome aboard!</p>
                            </div>
                        </div>
                    </div>
                )}

                {onboardingStatus === 'pending_contract' && (
                    <div className="flex justify-end">
                        <RippleButton 
                            size="sm" 
                            className="text-xs"
                            onClick={handleStartSigning}
                            disabled={initiatingSign}
                        >
                            {initiatingSign ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    Redirecting to Signing Page...
                                </>
                            ) : (
                                <>
                                    <SignatureIcon />
                                    Start Signing Process
                                </>
                            )}
                        </RippleButton>
                    </div>
                )}

                <div>
                    {contractUrl ? (
                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                            <div style={{ width: '100%', height: '600px', position: 'relative', backgroundColor: '#f5f5f5' }}>
                                <object
                                    data={contractUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ minHeight: '600px', border: 'none' }}
                                    title="Contract Document Preview"
                                >
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                                        <p className="text-gray-600 mb-4 text-center">
                                            Your browser doesn't support inline PDF viewing.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => window.open(contractUrl, '_blank')}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Contract
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = contractUrl;
                                                    link.download = 'contract.pdf';
                                                    link.click();
                                                }}
                                                className="inline-flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </object>
                            </div>
                            <div className="mt-2 text-center border-t pt-2 bg-white">
                                <a
                                    href={contractUrl}
                                    download="contract.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Contract
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-12 bg-gray-50 rounded-lg">
                            <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
                            <span className="ml-3 text-gray-600">Loading contract document...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Fallback for any unexpected status
    return (
        <div className="space-y-6 max-w-2xl mx-auto pt-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
                <p className="text-gray-600">Please complete your registration to access the contract</p>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-500">
                    Contact our support team if you need assistance.
                </p>
            </div>
        </div>
    );
}

export default ContractSign
