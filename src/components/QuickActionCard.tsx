import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: boolean;
}

const QuickActionCard = ({ title, description, icon: Icon, href, gradient }: QuickActionCardProps) => {
  return (
    <Link to={href} className="block group">
      <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        gradient ? 'bg-gradient-to-br from-accent to-secondary border-0' : ''
      }`}>
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className={`p-4 rounded-full ${
            gradient ? 'bg-white/20' : 'bg-primary/10'
          } group-hover:scale-110 transition-transform`}>
            <Icon className={`h-8 w-8 ${
              gradient ? 'text-white' : 'text-primary'
            }`} />
          </div>
          <h3 className={`font-semibold text-lg ${
            gradient ? 'text-white' : 'text-foreground'
          }`}>
            {title}
          </h3>
          <p className={`text-sm ${
            gradient ? 'text-white/90' : 'text-muted-foreground'
          }`}>
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuickActionCard;
