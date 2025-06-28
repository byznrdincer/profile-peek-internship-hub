
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowLeft } from "lucide-react";

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          InternStack
        </h1>
      </div>
    </>
  );
};

export default AuthHeader;
