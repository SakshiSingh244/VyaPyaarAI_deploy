import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, TrendingUp, Calculator, Target, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  category: string;
  productName: string;
  costPrice: string;
  description: string;
  platform: string;
}

interface PriceRecommendation {
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  profitMargin: number;
  competitorAnalysis: string;
  platformFees: string;
}

interface ScrapedPrices {
  min?: number;
  max?: number;
  avg?: number;
  count?: number;
  error?: string;
}

export function AIPricingPage() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [priceRecommendation, setPriceRecommendation] = useState<PriceRecommendation | null>(null);
  const [scrapedPrices, setScrapedPrices] = useState<ScrapedPrices | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem("product_data");
    if (!data) {
      navigate("/sell-online");
      return;
    }
    const parsed = JSON.parse(data);
    setProductData(parsed);
    setSelectedPlatform(parsed.platform);
  }, [navigate]);

  const fetchScrapedPrices = async () => {
    if (!productData?.productName) return;
    
    setIsScraping(true);
    try {
      const response = await fetch('http://localhost:5000/api/scrape-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName: productData.productName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      setScrapedPrices(data);
      
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Scraping Error",
          description: data.error,
        });
      } else {
        toast({
          title: "Competitor Data Fetched",
          description: `Found ${data.count} price points from Meesho`,
        });
      }
    } catch (error) {
      setScrapedPrices({ error: error instanceof Error ? error.message : 'Oops! This feature works only when running locally. Try it on your local setup. 😊' });
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: "Could not fetch competitor prices",
      });
    } finally {
      setIsScraping(false);
    }
  };

  const calculatePrice = async () => {
    if (!productData || !selectedPlatform) return;
    
    setIsCalculating(true);
    
    // First fetch competitor prices
    await fetchScrapedPrices();

    // Calculate recommended price based on scraped data or fallback multipliers
    const costPrice = parseInt(productData.costPrice);
    const platformMultipliers: Record<string, number> = {
      "Meesho": 2.2,
      "Amazon": 2.8,
      "Flipkart": 2.5,
      "Instagram": 2.0,
      "WhatsApp Business": 1.8,
      "Facebook Marketplace": 2.1
    };
    
    // Use scraped average if available, otherwise use platform multiplier
    const baseMultiplier = scrapedPrices?.avg && scrapedPrices.avg > costPrice
      ? (scrapedPrices.avg / costPrice) * 0.95 // Slightly undercut average
      : platformMultipliers[selectedPlatform] || 2.5;
    
    const recommendedPrice = Math.round(costPrice * baseMultiplier);
    const minPrice = Math.round(costPrice * (baseMultiplier - 0.3));
    const maxPrice = Math.round(costPrice * (baseMultiplier + 0.5));
    
    const competitorAnalysis = scrapedPrices?.min && scrapedPrices.max
      ? `Competitor prices on Meesho range from ₹${scrapedPrices.min} to ₹${scrapedPrices.max} (avg ₹${scrapedPrices.avg}). `
      : '';
    
    const recommendation: PriceRecommendation = {
      minPrice,
      maxPrice,
      recommendedPrice,
      profitMargin: Math.round(((recommendedPrice - costPrice) / costPrice) * 100),
      competitorAnalysis: competitorAnalysis + 
        `Our AI recommends pricing between ₹${minPrice} - ₹${maxPrice} for ${selectedPlatform}. ` +
        `The sweet spot of ₹${recommendedPrice} gives you a ${Math.round(((recommendedPrice - costPrice) / costPrice) * 100)}% profit margin.`,
      platformFees: selectedPlatform === "Amazon" ? "Amazon charges 8-15% commission" : 
                   selectedPlatform === "Flipkart" ? "Flipkart charges 5-20% commission" :
                   selectedPlatform === "Meesho" ? "Meesho has 0% commission for sellers" :
                   "Platform fees vary, factor in 5-10% for payment processing"
    };
    
    setPriceRecommendation(recommendation);
    setIsCalculating(false);
    toast({
      title: "Price Calculated! 💰",
      description: "Your AI-powered pricing recommendations are ready.",
    });
  };

  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/listing-guide")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-success p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Guided Selling Price</h1>
              <p className="text-sm text-muted-foreground">Smart pricing for maximum profit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Product & Cost Info */}
        <Card className="mb-6 shadow-elegant border-0 bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Product Cost Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Product:</strong> {productData.productName}</p>
              <p><strong>Category:</strong> {productData.category}</p>
            </div>
            <div>
              <p><strong>Your Cost Price:</strong> ₹{productData.costPrice}</p>
              <p><strong>Current Platform:</strong> {productData.platform}</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card className="mb-6 shadow-warm border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Select Selling Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your selling platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Meesho">Meesho</SelectItem>
                <SelectItem value="Amazon">Amazon</SelectItem>
                <SelectItem value="Flipkart">Flipkart</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="WhatsApp Business">WhatsApp Business</SelectItem>
                <SelectItem value="Facebook Marketplace">Facebook Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Competitor Price Data */}
        {scrapedPrices && (
          <Card className="mb-6 shadow-warm border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Competitor Price Data
                {isScraping && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scrapedPrices.error ? (
                <p className="text-red-500">{scrapedPrices.error}</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                    <p className="text-xl font-bold">₹{scrapedPrices.avg || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest Price</p>
                    <p className="text-xl font-bold">₹{scrapedPrices.min || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Price</p>
                    <p className="text-xl font-bold">₹{scrapedPrices.max || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Products Found</p>
                    <p className="text-xl font-bold">{scrapedPrices.count || '0'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={calculatePrice}
            disabled={isCalculating || !selectedPlatform}
            className="bg-gradient-primary text-white hover:opacity-90 px-8 py-3 text-lg"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating Best Price...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-5 w-5" />
                Get Suggested Price Range
              </>
            )}
          </Button>
        </div>

        {/* Price Recommendations */}
        {priceRecommendation && (
          <div className="space-y-6">
            {/* Price Range Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg text-red-600">Minimum Price</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">₹{priceRecommendation.minPrice}</p>
                  <p className="text-sm text-muted-foreground">Break-even point</p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-2 border-green-500 bg-gradient-success">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg text-white">Recommended Price</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-white">₹{priceRecommendation.recommendedPrice}</p>
                  <p className="text-sm text-green-100">Sweet spot for sales</p>
                </CardContent>
              </Card>

              <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg text-blue-600">Maximum Price</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">₹{priceRecommendation.maxPrice}</p>
                  <p className="text-sm text-muted-foreground">Premium pricing</p>
                </CardContent>
              </Card>
            </div>

            {/* Profit Analysis */}
            <Card className="shadow-elegant border-0 bg-gradient-primary">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Profit Margin Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Profit per unit:</strong> ₹{priceRecommendation.recommendedPrice - parseInt(productData.costPrice)}</p>
                    <p><strong>Profit margin:</strong> {priceRecommendation.profitMargin}%</p>
                  </div>
                  <div>
                    <p><strong>Cost price:</strong> ₹{productData.costPrice}</p>
                    <p><strong>Selling price:</strong> ₹{priceRecommendation.recommendedPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Market Analysis & Platform Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Competitor Analysis:</h4>
                  <p className="text-muted-foreground">{priceRecommendation.competitorAnalysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platform Fees:</h4>
                  <p className="text-muted-foreground">{priceRecommendation.platformFees}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Tips */}
        <Card className="mt-8 shadow-elegant border-0 bg-gradient-primary
        ">
          <CardHeader>
            <CardTitle className="text-white">💡 Smart Pricing Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <ul className="space-y-2 text-sm">
              <li>• Start with the recommended price and adjust based on customer response</li>
              <li>• Consider offering launch discounts to attract initial customers</li>
              <li>• Monitor competitor prices regularly and adjust accordingly</li>
              <li>• Factor in shipping costs when setting your final price</li>
              <li>• Higher prices can indicate premium quality to customers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
