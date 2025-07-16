import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User, Target, DollarSign, MapPin } from "lucide-react";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  suggestions?: string[];
}

export function PlatformRecommenderPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    const initialMessage: Message = {
      id: "1",
      type: "bot",
      content: "Namaste! I'm your Platform Recommender AI 🤖\n\nI'll help you find the perfect platform to sell your products. Let's start with understanding what you want to sell!\n\nWhat type of product are you planning to sell online?",
      suggestions: ["Fashion Items", "Beauty Products", "Handmade Crafts", "Electronics", "Food Items", "Home Decor"]
    };
    setMessages([initialMessage]);
  }, []);

  const addBotMessage = (content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = (message: string = inputValue) => {
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
    
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerMessage = message.toLowerCase();
      
      // Conversation flow based on stage
      if (conversationStage === 0) {
        // First question about product type
        addBotMessage(
          `Great choice! ${message} can do really well online 👍\n\nNow, tell me about your experience level:\n\nHave you sold products online before?`,
          ["Complete beginner", "Some experience", "Experienced seller", "I've tried but struggled"]
        );
        setConversationStage(1);
      } else if (conversationStage === 1) {
        // Experience level
        let experienceResponse = "";
        if (lowerMessage.includes('beginner') || lowerMessage.includes('new')) {
          experienceResponse = "Perfect! I'll recommend beginner-friendly platforms 🌱";
        } else if (lowerMessage.includes('some') || lowerMessage.includes('little')) {
          experienceResponse = "Good! You have some foundation to build on 📈";
        } else if (lowerMessage.includes('experienced')) {
          experienceResponse = "Excellent! We can explore advanced platforms 🚀";
        } else {
          experienceResponse = "No worries! Let's find what works better for you 💪";
        }
        
        addBotMessage(
          `${experienceResponse}\n\nNext question: What's your budget for getting started?\n\n(This includes listing fees, marketing, packaging, etc.)`,
          ["Under ₹5,000", "₹5,000 - ₹20,000", "₹20,000 - ₹50,000", "Above ₹50,000", "I want to start free"]
        );
        setConversationStage(2);
      } else if (conversationStage === 2) {
        // Budget
        addBotMessage(
          `Got it! Budget planning is smart 💰\n\nLast question: Which region do you primarily want to serve?\n\n(This affects shipping costs and customer reach)`,
          ["My local city", "My state", "All of India", "Metro cities only", "Rural areas", "International too"]
        );
        setConversationStage(3);
      } else if (conversationStage === 3) {
        // Final recommendations
        generateRecommendations();
        setConversationStage(4);
      } else {
        // Continue conversation
        addBotMessage(
          "That's helpful additional information! 📝\n\nBased on everything you've told me, my recommendations remain the same. Would you like me to explain any platform in more detail, or shall we proceed with your choice?",
          ["Tell me more about Meesho", "Explain Amazon process", "How does Instagram work?", "I'm ready to proceed"]
        );
      }
    }, 1500);
  };

  const generateRecommendations = () => {
    const recommendations = `Perfect! Based on your responses, here are my top platform recommendations for you:\n\n🥇 **MEESHO** (Best for beginners)\n• Zero listing fees\n• Easy setup process\n• Great for fashion & home products\n• Strong support system\n\n🥈 **AMAZON** (For serious sellers)\n• Huge customer base\n• Fulfillment support available\n• Higher fees but better visibility\n• Professional selling tools\n\n🥉 **INSTAGRAM SHOP** (Creative freedom)\n• Direct customer connection\n• Great for handmade/unique items\n• Free to start\n• Build your own brand\n\n📱 **WhatsApp Business** (Local sales)\n• Perfect for local customers\n• No fees\n• Personal touch\n• Easy communication\n\nWhich platform interests you most? I can help you get started!`;

    addBotMessage(
      recommendations,
      ["Start with Meesho", "Learn about Amazon", "Set up Instagram Shop", "Use WhatsApp Business", "Compare all options"]
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes("Meesho") && conversationStage === 4) {
      // Store recommendation and navigate to form
      localStorage.setItem("recommended_platform", "Meesho");
      navigate("/product-form");
      return;
    }
    
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
            onClick={() => navigate("/sell-online")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Platform Recommender</h1>
              <p className="text-sm text-muted-foreground">Find your perfect selling platform</p>
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
                <div className="bg-blue-500 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
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
                
                {/* Suggestions */}
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
              <div className="bg-blue-500 p-2 rounded-full h-10 w-10 flex items-center justify-center">
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

        {/* Progress Indicator */}
        {conversationStage < 4 && (
          <div className="mb-4 bg-card/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Progress: {conversationStage}/3 questions completed
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(conversationStage / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Input */}
        <Card className="border-border/50 shadow-warm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
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