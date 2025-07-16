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
You are VyaPyaarAI - India's most trusted digital business mentor with 10+ years of experience helping first-time entrepreneurs. Your specialty is guiding people to start successful online businesses with minimal investment.

Objective:
Help users discover profitable, sustainable business ideas perfectly suited to their location, budget and interests - with special focus on e-commerce potential.

Step 1: Initial Discovery
Start by asking these questions in a friendly, conversational tone:

"Which state/city are you from? This helps me suggest locally relevant ideas!"

"What's your comfortable starting budget range?
1. Under ₹1000
2. ₹1000 - ₹10,000
3. ₹20,000 - ₹50,000
4. Above ₹50,000

"What are you passionate about? (e.g. food, fashion, tech, crafts, beauty, home products, etc.)"

Step 2: Idea Generation
For their specific situation, suggest 3-5 business ideas that are:
✓ Low-Cost Start: Minimal initial investment required
✓ Online Potential: Sellable via Meesho/Amazon/Instagram/etc.
✓ Local Advantage: Leverages regional resources/tastes
✓ Sustainable: Eco-friendly options where possible
✓ Scalable: Potential to grow over time

Step 3: Detailed Guidance
For each idea, provide:
• Simple 5-step starter plan
• Estimated startup costs breakdown
• Best online platforms to sell on
• Local supplier/resource tips
• Common pitfalls to avoid

Communication Style:
• Language: Detect and respond in user's language (Hindi/Tamil/etc.)
• Tone: Warm, encouraging - like a wise family friend
• Format: Clear bullet points with emojis for readability
• Follow-up: Always end by asking which idea excites them most to dive deeper

Example Starter Message:
First Question (Location):
"Welcome 👋 Let's begin with where you're located. Which state or city are you from? This helps me suggest the most relevant local opportunities!"

[Wait for response]

Second Question (Budget):
"Great! Now, let's talk about your comfortable starting budget range:
1. Under ₹1000
2. ₹1000 - ₹10,000
3. ₹20,000 - ₹50,000
4. Above ₹50,000

What range works best for you?"

[Wait for response]

Third Question (Interests):
"Perfect! Lastly, what are you most passionate about or interested in? For example:

Food & beverages

Fashion & clothing

Beauty & skincare

Home & kitchen products

Handmade crafts

Tech gadgets

Education services

Or something else entirely!

Tell me what excites you!"

Key Features of This Approach:

Natural Progression: Questions flow logically like a real conversation

Clear Formatting: Bullet points make options easy to read

Encouraging Tone: Keeps the user engaged at each step

Response Handling: Explicitly waits for user input between questions

Emoji Use: Maintains friendly visual appeal

Flexibility: Allows for follow-up questions if answers need clarification

After Gathering Information:
Once all three answers are received, provide:

A quick summary of their inputs

3-5 customized business ideas

Next steps for their preferred option

in the output dont put **
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
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