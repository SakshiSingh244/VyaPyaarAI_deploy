import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Bot, CheckCircle, XCircle } from "lucide-react";

export function SellOnlinePage() {
  const [knowsPlatform, setKnowsPlatform] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handlePlatformChoice = (knows: boolean) => {
    setKnowsPlatform(knows);
    
    if (knows) {
      // Navigate to product form
      navigate("/product-form");
    } else {
      // Navigate to platform recommender
      navigate("/platform-recommender");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Sell Online</h1>
              <p className="text-sm text-muted-foreground">Get your products online quickly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Let's Get You Selling! 🚀
          </h2>
          <p className="text-lg text-muted-foreground">
            Quick question to get started on the right path
          </p>
        </div>

        {/* Question Card */}
        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Platform Selection</CardTitle>
            <CardDescription className="text-base">
              Do you already know which platform you want to sell on?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Yes Option */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-warm border-2 hover:border-primary/50 group"
              onClick={() => handlePlatformChoice(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Yes, I know! ✅</h3>
                    <p className="text-muted-foreground">
                      Perfect! I already have a platform in mind (like Meesho, Flipkart, Amazon, etc.)
                    </p>
                    <div className="mt-3 text-sm text-primary font-medium">
                      → Go straight to product details form
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No Option */}
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-warm border-2 hover:border-primary/50 group"
              onClick={() => handlePlatformChoice(false)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">No, help me choose! 🤔</h3>
                    <p className="text-muted-foreground">
                      I need guidance on which platform would be best for my product and situation
                    </p>
                    <div className="mt-3 text-sm text-primary font-medium">
                      → Chat with Platform Recommender AI
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="bg-accent/20 rounded-xl p-6 border border-accent/30">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>If you know the platform:</strong> We'll collect your product details and create a step-by-step listing guide</p>
            <p>• <strong>If you need help choosing:</strong> Our AI will ask about your product, budget, and goals to recommend the perfect platform</p>
            <p>• Either way, we'll have you selling online in no time! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}