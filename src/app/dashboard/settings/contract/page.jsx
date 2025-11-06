"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, FileText, Download, Eye, Clock, CheckCircle2, FileSignature } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import User from '@/components/User';
import { Calendar03Icon } from 'hugeicons-react';
import { formatDate } from '@/utils/functions';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/my-contracts`,
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setContracts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getContractStatus = (contract) => {
    if (contract.signed_date) {
      return { label: 'Signed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
    } else if (contract.odoo_sign_request_id) {
      return { label: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloadingFile(fileId);
    try {
      // Step 1: Get presigned URL from backend
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/files/${fileId}/download`,
        { withCredentials: true }
      );

      const presignedUrl = response.data.data.url;

      // Step 2: Fetch the file from S3 using presigned URL (no credentials needed)
      const fileResponse = await fetch(presignedUrl);

      if (!fileResponse.ok) {
        throw new Error('Failed to download file from S3');
      }

      const blob = await fileResponse.blob();

      // Step 3: Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Step 4: Clean up
      window.URL.revokeObjectURL(blobUrl);

      toast.success('Contract downloaded successfully');
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast.error('Failed to download contract');
    } finally {
      setDownloadingFile(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Contracts</h1>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSignature className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Contracts Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                You don't have any contracts yet. Contracts will appear here once they are created.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {contracts.map((contract) => {
            const status = getContractStatus(contract);
            const StatusIcon = status.icon;

            return (
              <Card key={contract.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {contract.title}
                      </CardTitle>
                    </div>
                    <Badge className={status.color} variant="secondary">
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contract Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">




                    <div className='flex items-center gap-2'>
                      <div>
                        <Calendar03Icon size={25} strokeWidth={1} className='text-gray-500' />
                      </div>
                      <div>
                        <div className='font-medium translate-y-[2px] text-[11px] text-gray-500'>Start Date</div>
                        <div className='text-gray-600 translate-y-[-2px] text-xs font-semibold'>{formatDate(contract.start_date)}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">End Date</p>
                        <p className="text-sm text-muted-foreground">
                          {contract.end_date
                            ? format(new Date(contract.end_date), 'PP')
                            : 'Not set'}
                        </p>
                      </div>
                    </div>

                    {contract.signed_date && (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Signed Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(contract.signed_date), 'PP')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>



                  {/* Signed Contract File */}
                  {contract.signed_contract_file && (
                    <div className="">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(
                          contract.signed_contract_file.id,
                          contract.signed_contract_file.name
                        )}
                        disabled={downloadingFile === contract.signed_contract_file.id}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloadingFile === contract.signed_contract_file.id
                          ? 'Downloading...'
                          : 'Download'}
                      </Button>
                    </div>
                  )}

                  {/* Odoo Sign Request Info */}
                  {contract.odoo_sign_request_id && !contract.signed_date && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Waiting for signature. Check your email for the signing link.
                        </span>
                      </div>
                    </div>
                  )}


                  {/* Signed By Information */}
                  {contract.signed_by_team_member && (
                    <div className="pt-3">
                      <User user={{ ...contract.signed_by_team_member.user, job_title: "Contract Signatory" }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
