import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { RippleButton } from '../ui/shadcn-io/ripple-button';
import { SignatureIcon } from 'hugeicons-react';
import { useAuth } from "@/context/AuthContextProvider";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ContractSign = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [onboardingStatus, setOnboardingStatus] = useState('in_progress');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Fetch onboarding status
    useEffect(() => {
        const fetchOnboardingStatus = async () => {
            if (!user?.subagent_team_member?.agent?.id) return;

            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                    { withCredentials: true }
                );

                const agentData = response.data.data;
                setOnboardingStatus(agentData.onboarding_status || 'in_progress');
            } catch (error) {
                console.error("Error fetching onboarding status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOnboardingStatus();
    }, [user]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/pdf/Document1.pdf';
        link.download = 'Contract_Document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
                <span className="ml-2 text-gray-600">Loading contract...</span>
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

    // Block access for in_progress status
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

    // Only show contract for approved status
    if (onboardingStatus === 'approved') {
        return (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <RippleButton size="sm" className="text-xs">
                        <SignatureIcon />
                        Start Signing Process
                    </RippleButton>
                </div>

                <div>
                    <div className="rounded-lg overflow-hidden">
                        <iframe
                            src="/pdf/Document1.pdf#toolbar=1&navpanes=0&scrollbar=1"
                            width="100%"
                            height="600px"
                            className="border-0"
                            title="Contract Document Preview"
                        />
                    </div>
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
