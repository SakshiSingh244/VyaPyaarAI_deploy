import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProductFormPage() {
  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    costPrice: "",
    description: "",
    platform: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    "Fashion & Clothing",
    "Beauty & Skincare", 
    "Home & Kitchen",
    "Electronics & Gadgets",
    "Handmade & Crafts",
    "Food & Beverages",
    "Books & Stationery",
    "Sports & Fitness",
    "Toys & Games",
    "Jewelry & Accessories"
  ];

  const platforms = [
    "Meesho",
    "Amazon", 
    "Flipkart",
    "Myntra",
    "Nykaa",
    "Ajio",
    "Instagram Shop",
    "Facebook Marketplace",
    "WhatsApp Business",
    "Etsy",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.category || !formData.productName || !formData.costPrice || !formData.platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue! 📝",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Form Submitted Successfully! 🎉",
        description: "We're generating your personalized step-by-step guide...",
      });
      
      // Store form data and navigate to guide
      localStorage.setItem("product_data", JSON.stringify(formData));
      navigate("/listing-guide");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/sell-online")}
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
              <h1 className="font-bold text-lg">Product Details</h1>
              <p className="text-sm text-muted-foreground">Tell us about your product</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Let's Create Your Listing! ✨
          </h2>
          <p className="text-lg text-muted-foreground">
            Share your product details and we'll create a winning strategy
          </p>
        </div>

        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Product Information
            </CardTitle>
            <CardDescription>
              Fill in these details to get your personalized step-by-step guide
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Product Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your product category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="e.g., Handmade Cotton Kurta, Organic Face Cream"
                  className="transition-all duration-300 focus:shadow-warm"
                />
              </div>

              {/* Cost Price */}
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  placeholder="Enter your product cost"
                  className="transition-all duration-300 focus:shadow-warm"
                />
                <p className="text-sm text-muted-foreground">
                  This helps us suggest the right pricing strategy
                </p>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product, its benefits, materials, size, etc."
                  rows={4}
                  className="transition-all duration-300 focus:shadow-warm"
                />
                <p className="text-sm text-muted-foreground">
                  Optional: We'll help you improve this for better sales
                </p>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform Name *</Label>
                <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where do you want to sell?" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-6 transition-all duration-300 hover:shadow-elegant"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Your Guide..." : "Get Step-by-Step Guide 🚀"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 bg-accent/20 rounded-xl p-6 border border-accent/30">
          <h3 className="font-semibold text-lg mb-3">What you'll get:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ Personalized listing optimization tips</p>
            <p>✅ Pricing strategy recommendations</p>
            <p>✅ Photo and description guidelines</p>
            <p>✅ Platform-specific best practices</p>
            <p>✅ Marketing and promotion ideas</p>
          </div>
        </div>
      </div>
    </div>
  );
}