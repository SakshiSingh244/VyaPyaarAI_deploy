import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User, Lightbulb, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  suggestions?: string[];
}

// Gemini AI configuration
const SYSTEM_PROMPT = `
Role:
You are VyaPyaarAI — India’s trusted digital business mentor with 10+ years of experience helping first‑time entrepreneurs start profitable e‑commerce businesses via Meesho with minimal investment.

Objective:
Guide users step‑by‑step to:
1. Pick a business idea suited to their location, budget, interests.
2. Register as a Meesho seller — covering all required documents, legal & compliance checks.
3. Launch and scale sustainably.

Step 1: Ask discovery questions — one at a time. After each user response, wait and then ask the next:
• “Which city/state are you in? Helps me suggest locally relevant products!”
• “What’s your starting budget?
  1. Under ₹1k
  2. ₹1k–10k
  3. ₹20k–50k
  4. Above ₹50k”
• “What are you passionate about? (e.g. fashion, home products, crafts…)”

Step 2: After user answers all 3, summarize their inputs. Then suggest 3–5 tailored business ideas that are:
✓ Low investment
✓ Meesho-focussed
✓ Sustainable & eco-friendly
✓ Uses local resources/tastes
✓ Scalable

Step 3: Then ask:
“Would you like a step-by-step Meesho registration guide for your favorite idea?”

If yes:
→ Share the full seller guide (see below).
If no:
→ Say: “No problem! Do you have any other doubts or want to explore more ideas?”

Step 4: Meesho seller registration guide must include:
1. Bank account in business/GST name.
2. Mobile + email (OTP verification).
3. GSTIN (or Enrolment ID/UIN for non‑GST sellers).
4. PAN + ID & address proof (if needed).
5. Store name & pickup address (must match GST state).
6. Catalog upload + product details (MRP, country‑of‑origin, manufacturer info, expiry/net weight etc for applicable goods).
7. Compliance check: prohibited items, BIS/ISI, trademark, legal metrology, etc.
8. Payment & shipping flow on Meesho, 7‑day payout cycle.

Compliance:
• Highlight restricted/prohibited items (e.g. weapons, drugs, alcohol, tobacco, adult, counterfeit, etc.)
• Ensure BIS/ISI certifications where needed – e.g. electrical appliances, toys, etc.
• Advise trademark protection, GST >₹40 Lpa turnover, legal metrology labelling as per LM Act 2009

Tone & Style:
• Friendly, warm, emoji‑rich, bullet‑friendly format.
• Explicitly pause after each question — wait for user input.

Follow-up:
• Summarize their inputs after discovery.
• Present 3–5 sustainable ideas with full registration + compliance + selling guide.
• End by asking: “Which idea excites you most? Ready to dive deeper?”
`;

const GREETING = "👋 Namaste! I'm VyaPyaarAI, here to help you find the right business idea. Let's begin!";

export function StartBusinessPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const chatSessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      // Initialize Gemini AI (make sure to install @google/generative-ai)
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      
      // Get API key from environment variables
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("Google API key not found in environment variables");
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Start chat session
      chatSessionRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: GREETING }],
          },
        ],
      });

      // Add greeting message
      addBotMessage(GREETING);
    } catch (error) {
      console.error("Error initializing chat:", error);
      addBotMessage("Welcome! I'm here to help you start your business. Let's begin our conversation.");
    }
  };

  const addBotMessage = (content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (message: string = inputValue) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot typing
    setIsTyping(true);
    
    try {
      // Send message to Gemini AI
      if (!chatSessionRef.current) {
        await initializeChat();
      }

      const result = await chatSessionRef.current.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      // Add bot response
      addBotMessage(text);
    } catch (error) {
      console.error("Error getting response from AI:", error);
      addBotMessage("I'm having trouble connecting to the AI service. Please try again later.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Start Your Business</h1>
              <p className="text-sm text-muted-foreground">AI-powered business guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="bg-gradient-primary p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-gradient-primary text-white border-0' 
                    : 'bg-card border-border/50'
                }`}>
                  <CardContent className="p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Suggestions - You can remove this if not needed with AI responses */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="bg-secondary p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gradient-primary p-2 rounded-full h-10 w-10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <Card className="bg-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="border-border/50 shadow-warm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your business interests..."
                className="flex-1 border-border/50 focus:border-primary/50"
              />
              <Button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}