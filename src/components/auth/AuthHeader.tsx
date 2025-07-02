
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LILogo from "@/components/ui/LILogo";

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
        <LILogo />
        <h1 className="text-2xl font-bold">
          <span className="font-fredoka bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">lazy</span>
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Intern</span>
        </h1>
      </div>
    </>
  );
};

export default AuthHeader;
