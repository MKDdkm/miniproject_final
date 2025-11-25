import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Fruit Vision AI</h3>
            <p className="text-primary-foreground/90 text-sm">
              Simple fruit farming companion
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/90">
              <li>Disease Detection</li>
              <li>Market Prices</li>
              <li>Government Schemes</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Created by</h3>
            <div className="space-y-1 text-sm text-primary-foreground/90">
              <p>Mourya</p>
              <p>Mithun</p>
              <p>Sumanth</p>
              <p>Girish</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/80">
          <p>© 2025 Fruit Vision AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
