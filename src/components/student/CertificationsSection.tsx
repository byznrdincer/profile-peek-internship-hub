
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Upload, X, Download, ExternalLink, Calendar, Award } from "lucide-react";

interface Certification {
  id?: string;
  certification_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  credential_url: string;
  certificate_file_url?: string;
  certificate_filename?: string;
}

interface CertificationsSectionProps {
  certifications: Certification[];
  setCertifications: (certifications: Certification[]) => void;
}

const CertificationsSection = ({ certifications, setCertifications }: CertificationsSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        certification_name: "",
        issuing_organization: "",
        issue_date: "",
        expiry_date: "",
        credential_id: "",
        credential_url: "",
      }
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!user) return;

    setUploading(prev => ({ ...prev, [index]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      updateCertification(index, 'certificate_file_url', publicUrl);
      updateCertification(index, 'certificate_filename', file.name);

      toast({
        title: "Certificate uploaded",
        description: "Your certificate file has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading certificate:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const downloadCertificate = async (certification: Certification) => {
    if (!certification.certificate_file_url) return;

    try {
      const response = await fetch(certification.certificate_file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = certification.certificate_filename || 'certificate';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Certificate downloaded",
        description: "Your certificate has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the certificate.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications ({certifications.length})
          </CardTitle>
          <Button onClick={addCertification} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {certifications.map((certification, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
              <Button
                onClick={() => removeCertification(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-name-${index}`}>Certification Name *</Label>
                <Input
                  id={`cert-name-${index}`}
                  value={certification.certification_name}
                  onChange={(e) => updateCertification(index, 'certification_name', e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <Label htmlFor={`org-${index}`}>Issuing Organization</Label>
                <Input
                  id={`org-${index}`}
                  value={certification.issuing_organization}
                  onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
                <Input
                  id={`issue-date-${index}`}
                  type="date"
                  value={certification.issue_date}
                  onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
                <Input
                  id={`expiry-date-${index}`}
                  type="date"
                  value={certification.expiry_date}
                  onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`credential-id-${index}`}>Credential ID</Label>
                <Input
                  id={`credential-id-${index}`}
                  value={certification.credential_id}
                  onChange={(e) => updateCertification(index, 'credential_id', e.target.value)}
                  placeholder="e.g., ABC123DEF456"
                />
              </div>
              <div>
                <Label htmlFor={`credential-url-${index}`}>Credential URL</Label>
                <Input
                  id={`credential-url-${index}`}
                  value={certification.credential_url}
                  onChange={(e) => updateCertification(index, 'credential_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`certificate-file-${index}`}>Certificate File</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    id={`certificate-file-${index}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                    disabled={uploading[index]}
                  />
                </div>
                {certification.certificate_file_url && (
                  <Button
                    onClick={() => downloadCertificate(certification)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
              {uploading[index] && (
                <p className="text-sm text-blue-600 mt-1">Uploading...</p>
              )}
              {certification.certificate_filename && (
                <p className="text-sm text-gray-600 mt-1">
                  Current file: {certification.certificate_filename}
                </p>
              )}
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No certifications added yet.</p>
            <p className="text-sm">Add your professional certifications to showcase your expertise.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
