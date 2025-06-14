
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const LINKEDIN_URL = "https://www.linkedin.com/in/zivhundert/";

export function LinkedInFollowButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]/10 transition-all"
          aria-label="Follow on LinkedIn"
          onClick={() => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span>Follow on LinkedIn</span>
      </TooltipContent>
    </Tooltip>
  );
}
