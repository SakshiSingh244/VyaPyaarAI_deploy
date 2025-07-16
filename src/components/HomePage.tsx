import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Package, LogOut, Sparkles, TrendingUp } from "lucide-react";

export function HomePage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("vyapyaar_user");
    if (!userData) {
      navigate("/");
      return;
    }
    
    const user = JSON.parse(userData);
    setUsername(user.username);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vyapyaar_user");
    navigate("/");
  };

  const navigateToStartBusiness = () => {
    navigate("/start-business");
  };

  const navigateToSellOnline = () => {
    navigate("/sell-online");
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              VyaPyaarAI
            </span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Hey, {username}! 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to turn your dreams into reality? Let's build something amazing together! ✨
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Start a Business Card */}
          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-0 bg-gradient-success backdrop-blur-sm">
            <CardContent className="p-8 text-center" onClick={navigateToStartBusiness}>
              <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <Store className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                🏪 Start a Business
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Have a business idea? Let our AI guide you through every step - from choosing the right product to setting up your venture! 
              </p>
              
              <div className="text-sm text-accent-foreground font-medium flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Perfect for new entrepreneurs
              </div>
            </CardContent>
          </Card>

          {/* Sell Online Card */}
          <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-0 bg-card backdrop-blur-sm">
            <CardContent className="p-8 text-center" onClick={navigateToSellOnline}>
              <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <Package className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                📦 Sell Online
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Already have a product? Let's get you selling online! We'll help you choose the best platform and create winning listings.
              </p>
              
              <div className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                <Package className="h-4 w-4" />
                Quick setup & launch
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Footer */}
        <div className="text-center mt-12 p-6 bg-card/30 rounded-2xl backdrop-blur-sm border border-border/50">
          <p className="text-lg text-muted-foreground italic">
            "Every big business started with a small dream. Today is your day to start!" 🌟
          </p>
        </div>
      </div>
    </div>
  );
}