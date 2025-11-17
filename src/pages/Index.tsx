import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Minimize2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design for modern professionals',
      icon: Sparkles,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and colorful design for creative professionals',
      icon: Palette,
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant design with focus on content',
      icon: Minimize2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Card Template</h1>
          <p className="text-lg text-muted-foreground">Select a template to get started with your digital business card</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{template.description}</p>
                    <Button 
                      onClick={() => navigate('/cards/new')}
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/cards/new')}
          >
            Create Custom Card
          </Button>
        </div>
      </div>
    </div>
  );
}
