"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, FileText, Download, Eye, Clock, CheckCircle2, FileSignature } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import User from '@/components/User';
import { Calendar03Icon, SignatureIcon } from 'hugeicons-react';
import { formatDate } from '@/utils/functions';
import { Badge } from '@radix-ui/themes';

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
      return { label: 'Signed', color: 'green', icon: SignatureIcon };
    } else if (contract.odoo_sign_request_id) {
      return { label: 'Pending Signature', color: 'yellow', icon: Clock };
    } else {
      return { label: 'Draft', color: 'gray', icon: FileText };
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Contracts</h1>
      </div>


      {
        (loading) ? (
          <div className="grid xl:grid-cols-2 gap-4">
            {Array.from({ length: 1 }).map((_, index) => (
              <div key={index} className="bg-linear-to-br space-y-6 from-primary/5 to-transparent rounded-3xl border p-6">

                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-48 rounded-md border" />
                  <Skeleton className="h-7 w-24 border rounded-full" />
                </div>

                <div className="flex gap-4">
                  <Skeleton className="h-8 w-24 border rounded-md" />
                  <Skeleton className="h-8 w-24 border rounded-md" />
                  <Skeleton className="h-8 w-24 border rounded-md" />
                </div>

                <div className="flex items-center justify-between">
                  <div className='flex gap-2'>
                    <Skeleton className="h-9 w-9 rounded-full border" />
                    <div>
                      <Skeleton className="h-4 w-20 rounded-md border mb-1" />
                      <Skeleton className="h-3 w-28 rounded-md border" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-7 w-20 border rounded-md" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) :
          (
            contracts.length === 0 ? (
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
              <div className="grid xl:grid-cols-2 gap-4">
                {contracts.map((contract) => {
                  const status = getContractStatus(contract);
                  const StatusIcon = status.icon;

                  return (
                    <div key={contract.id} className="bg-linear-to-br space-y-6 from-primary/5 to-transparent rounded-3xl border p-6">



                      <div className="flex items-center justify-between">

                        <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                          {contract.title}
                        </h2>

                        <Badge color={status.color} radius='full' style={{ gap: 4, padding: '4px 10px' }} size="3" variant="soft">
                          <StatusIcon size={18} />
                          {status.label}
                        </Badge>

                      </div>




                      {/* Contract Details */}
                      <div className="flex gap-8">

                        <div className='flex items-center gap-2'>
                          <div>
                            <Calendar03Icon size={25} strokeWidth={1} className='text-neutral-500' />
                          </div>
                          <div>
                            <div className='font-medium translate-y-[2px] text-[11px] text-neutral-500'>Start Date</div>
                            <div className='text-neutral-600 translate-y-[-2px] text-xs font-semibold'>{contract.start_date ? formatDate(contract.start_date) : 'Not set'}</div>
                          </div>
                        </div>

                        <div className='flex items-center gap-2'>
                          <div>
                            <Calendar03Icon size={25} strokeWidth={1} className='text-neutral-500' />
                          </div>
                          <div>
                            <div className='font-medium translate-y-[2px] text-[11px] text-neutral-500'>End Date</div>
                            <div className='text-neutral-600 translate-y-[-2px] text-xs font-semibold'>{contract.end_date ? formatDate(contract.end_date) : '--'}</div>
                          </div>
                        </div>

                        {contract.signed_date && (
                          <div className='flex items-center gap-2'>
                            <div>
                              <Calendar03Icon size={25} strokeWidth={1} className='text-neutral-500' />
                            </div>
                            <div>
                              <div className='font-medium translate-y-[2px] text-[11px] text-neutral-500'>Signed Date</div>
                              <div className='text-neutral-600 translate-y-[-2px] text-xs font-semibold'>{formatDate(contract.signed_date)}</div>
                            </div>
                          </div>
                        )}
                      </div>

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

                      <div className="flex justify-between items-center">
                        <div>
                          {contract.signed_by_team_member && (
                            <User user={{ ...contract.signed_by_team_member.user, job_title: "Contract Signatory" }} />
                          )}
                        </div>

                        <div>
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
                                {/* <Download /> */}
                                {downloadingFile === contract.signed_contract_file.id
                                  ? 'Downloading...'
                                  : 'Download'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>



                    </div>



                  );
                })}
              </div>
            )
          )
      }
    </div>
  );
};

export default ContractsPage;
