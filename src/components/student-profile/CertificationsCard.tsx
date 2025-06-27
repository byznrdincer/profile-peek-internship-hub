
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificationsCardProps {
  certifications: any[];
}

const CertificationsCard = ({ certifications }: CertificationsCardProps) => {
  const { toast } = useToast();

  const handleDownloadCertificate = async (certification: any) => {
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
        description: "Certificate has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the certificate.",
        variant: "destructive",
      });
    }
  };

  if (certifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Certifications ({certifications.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {certifications.map((certification: any, index: number) => (
          <div key={index} className="border-l-4 border-green-200 pl-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{certification.certification_name}</h4>
              <div className="flex gap-2">
                {certification.credential_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(certification.credential_url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Verify
                  </Button>
                )}
                {certification.certificate_file_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadCertificate(certification)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Certificate
                  </Button>
                )}
              </div>
            </div>
            
            {certification.issuing_organization && (
              <p className="text-gray-600 mb-2">
                <strong>Issued by:</strong> {certification.issuing_organization}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              {certification.issue_date && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Issued: {new Date(certification.issue_date).toLocaleDateString()}
                </Badge>
              )}
              {certification.expiry_date && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                </Badge>
              )}
              {certification.credential_id && (
                <Badge variant="secondary" className="text-xs">
                  ID: {certification.credential_id}
                </Badge>
              )}
              {certification.certificate_file_url && (
                <Badge variant="default" className="text-xs bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Certificate Available
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CertificationsCard;
