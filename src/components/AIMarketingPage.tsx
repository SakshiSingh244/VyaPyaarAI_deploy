import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Megaphone, Copy, Instagram, MessageCircle, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

interface ProductData {
  category: string;
  productName: string;
  costPrice: string;
  description: string;
  platform: string;
}

interface MarketingContent {
  instagramCaption: string;
  whatsappMessage: string;
  offerTagline: string;
}

export function AIMarketingPage() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [targetAudience, setTargetAudience] = useState("");
  const [marketingContent, setMarketingContent] = useState<MarketingContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem("product_data");
    if (!data) {
      navigate("/sell-online");
      return;
    }
    setProductData(JSON.parse(data));
  }, [navigate]);

  const generateMarketingContent = async (product: ProductData, audience: string) => {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.8,
      },
    });

    const prompt = `
You are an expert digital marketer specializing in e-commerce promotions. Create compelling marketing content for:

**Product:** ${product.productName}
**Category:** ${product.category}
**Description:** ${product.description}
**Platform:** ${product.platform}
**Target Audience:** ${audience || "general consumers"}

Generate:
1. An engaging Instagram caption (with 5 relevant hashtags)
2. A persuasive WhatsApp marketing message (with emojis and clear CTA)
3. A short, impactful offer tagline (max 10 words)

Format response as JSON:
{
  "instagramCaption": "string (with emojis and hashtags)",
  "whatsappMessage": "string (with emojis and clear CTA)",
  "offerTagline": "string (short and impactful)"
}

Guidelines:
- Use emojis appropriately
- Include power words (e.g., Exclusive, Limited, Premium)
- Create urgency (e.g., "Limited Time Offer")
- Highlight benefits, not just features
- Match brand voice for ${product.platform}
- Make it scannable and engaging
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/^```json|```$/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error("Failed to generate content. Please try again.");
    }
  };

  const generateContent = async () => {
    if (!productData) return;
    
    setIsGenerating(true);
    
    try {
      const audience = targetAudience || "general consumers";
      const content = await generateMarketingContent(productData, audience);
      
      setMarketingContent(content);
      toast({
        title: "Marketing Content Generated! 🎉",
        description: "Your promotional content is ready to boost sales.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed ❌",
        description: error instanceof Error ? error.message : "There was an issue generating content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: `${type} copied to clipboard.`,
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
            <div className="bg-gradient-accent p-2 rounded-lg">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Marketing Content Generator</h1>
              <p className="text-sm text-muted-foreground">Create engaging promotional content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Product Info */}
        <Card className="mb-6 shadow-elegant border-0 bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Product:</strong> {productData.productName}</p>
              <p><strong>Category:</strong> {productData.category}</p>
            </div>
            <div>
              <p><strong>Platform:</strong> {productData.platform}</p>
              <p><strong>Description:</strong> {productData.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience Input */}
        <Card className="mb-6 shadow-warm border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="audience">Who is your ideal customer?</Label>
              <Input
                id="audience"
                placeholder="e.g., working professionals, college students, new parents"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Helps generate more targeted content (leave blank for general audience)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={generateContent}
            disabled={isGenerating}
            className="bg-gradient-primary text-white hover:opacity-90 px-8 py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Megaphone className="mr-2 h-5 w-5 animate-pulse" />
                Generating Content...
              </>
            ) : (
              <>
                <Megaphone className="mr-2 h-5 w-5" />
                Generate Marketing Content
              </>
            )}
          </Button>
        </div>

        {/* Generated Content */}
        {marketingContent && (
          <div className="space-y-6 animate-fade-in">
            {/* Instagram Caption */}
            <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    Instagram Caption
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(marketingContent.instagramCaption, "Instagram Caption")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{marketingContent.instagramCaption}</pre>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Message */}
            <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    WhatsApp Message
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(marketingContent.whatsappMessage, "WhatsApp Message")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                  <pre className="whitespace-pre-wrap text-sm">{marketingContent.whatsappMessage}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Offer Tagline */}
            <Card className="shadow-elegant border-0 bg-gradient-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Promotional Tagline
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary hover:text-primary bg-white/90"
                    onClick={() => copyToClipboard(marketingContent.offerTagline, "Offer Tagline")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white text-center">{marketingContent.offerTagline}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Marketing Tips */}
        <Card className="mt-8 shadow-elegant border-0 bg-gradient-primary">
          <CardHeader>
            <CardTitle className="text-white">📢 Marketing Success Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <ul className="space-y-2 text-sm">
              <li>• Post Instagram content when your audience is most active (check Insights)</li>
              <li>• Personalize WhatsApp messages with the recipient's name when possible</li>
              <li>• Use the tagline in all your marketing materials for consistency</li>
              <li>• Test different versions to see what converts best</li>
              <li>• Include social proof like testimonials or user counts</li>
              <li>• Create a sense of urgency with time-sensitive offers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}